import React, { useState, useEffect, useRef } from "react";
import './src/styles/Styles.css';
import About from "./About";
import Contact from "./Contact";
import Quiz from "./Quiz";
import FloatingActionButton from "./FloatingActionButton";
import { Link } from "react-router-dom";



const AIWebsite = () => {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [filterBy, setFilterBy] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(16);
    const [error, setError] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState (new Date());
    const articlesListRef = useRef(null);
    const [articleText, setArticleText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const synthRef = useRef(window.speechSynthesis);
    const utteranceRef = useRef(null);

    useEffect(() => {
        fetchArticles();
        // Update current date and time every second
        const intervalId = setInterval( ()=> {
            setCurrentDateTime(new Date());
        }, 2000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const fetchArticles = () => {
        fetch('https://newsdata.io/api/1/news?apikey=pub_425732c27ef1eeef1d66e821b6dbed936f031&q=Nigeria&country=ng')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data && data.results) {
                    const modifiedArticles = modifyArticles(data.results);
                    setArticles(modifiedArticles);
                    filterAndSortArticles(modifiedArticles);
                } else {
                    throw new Error("Invalid API response");
                }
            })
            .catch(error => {
                let errorMessage = "An error occured while fetching article.";
                if (error instanceof TypeError && error.message === "Failed to fetch") {
                    errorMessage = "Network error: Unable to connect to the server. Please check your internet connection.";
                } else if (error.message)
                setError(error.message.startsWith("Invalid API response")); {
                    errorMessage = "Invalid API response: The server returned unexpected data.";
                } 
                setError(errorMessage);
            });
    };

    const modifyArticles = (results) => {
        return results.map(article => ({
            article_id: article.article_id,
            title: article.title || "Untitled",
            url: article.link || "#",
            description: article.description || "No description available",
            pubDate: article.pubDate || "Unknown",
            image_url: article.image_url,
            section: article.category && article.category.length > 0 ? article.category[0] : "Uncategorized",
        }));
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const speakText = (title, description) => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }

        const text = `${title}. ${description}`;
        utteranceRef.current = new SpeechSynthesisUtterance(text);

        utteranceRef.current.onend = ()=> {
            setIsSpeaking(false);
        };

        synthRef.current.speak(utteranceRef.current);
        setArticleText(text);
        setIsSpeaking(true);

    };

    const togglePlayPause = () => {
        if (isSpeaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        } else if (articleText) {
            speakText("", articleText); // Resume speaking the current article text 
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        filterAndSortArticles();
    };

    const handleChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        filterAndSortArticles(articles);
    };

    const handleFilterChange = (event) => {
        setFilterBy(event.target.value);
        filterAndSortArticles(articles);
    };

    const filterAndSortArticles = (articles) => {
        let filtered = [...articles].filter(article =>
            article.title.toLowerCase().includes(searchTerm)
        );

        if (filterBy) {
            filtered = filtered.filter(article => article.section.toLowerCase() === filterBy.toLowerCase());
        }

        let sortedArticles = [...filtered];
        if (sortBy === 'newest') {
            sortedArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        } else if (sortBy === 'oldest') {
            sortedArticles.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
        }
        setFilteredArticles(sortedArticles);
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const shareOnTwitter = (url) => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`);
        alert("Shared on Twitter!");
    };

    const shareOnFacebook = (url) => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        alert("Shared on Facebook!");
    };

    const shareOnLinkedIn = (url) => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        alert("Shared on LinkedIn!");
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextItem = articlesListRef.current.querySelector('li:focus-within').nextSibling;
            if (nextItem) {
                nextItem.querySelector('button').focus();
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevItem = articlesListRef.current.querySelector('li:focus-within').previousSibling;
            if (prevItem) {
                prevItem.querySelector('button').focus();
            }
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredArticles.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const formattedDate = currentDateTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    });

    const navigateToCategory = (category) => {
        // Construct the route with the category name
        const route = `/articles/${category}`;
        // Use the link component to navigate
        return <Link to={route} />
    }

    // Function to handle submission of a new comment
    const handleSubmitComment = (event) => {
        event.preventDefault();
        if (newComment.trim() !== "") {
            setComments( [...comments, newComment]);
            setNewComment(""); // Clear input field after submission
        } 
    };


    return (
        <div className={darkMode ? "dark-mode" : "light-mode"}>
            <header>
                <div className="datetime">
                    <p>{formattedDate}</p>  
        
                </div>
                <h1>Ginja News Website</h1>
                
                <nav>
                    <ul>
                        <li><Link to="/" className="nav-link">Home</Link></li>
                        <li><Link to="news" className="nav-link">News</Link></li>
                        <li><Link to="business" className="nav-link">Business</Link></li>
                        <li><Link to="sports" className="nav-link">Sports</Link></li>
                        <li><Link to="worldNews" className="nav-link">World News</Link></li>
                    </ul>
                </nav>
                <button className="mode-button" onClick={toggleDarkMode}>
                    {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
            </header>

            {error && (
                <div className="error-container">
                    <p>Error: {error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            )}
            <FloatingActionButton navigateToCategory={navigateToCategory}/>
            <section id="hero">
                <h2>Welcome to our Ginja News Website</h2>
                <p>Stay updated with the Headlines news from Nigeria</p>
                <form id="search-form" onSubmit={handleSubmit}>
                    <input type="text" id="search-input" name="search" value={searchTerm} onChange={handleChange} placeholder="Search News" />
                    <button type="submit">Search</button>
                </form>
                <div>
                    <label htmlFor="sort-select">Sort by:</label>
                    <select id="sort-select" value={sortBy} onChange={handleSortChange}>
                        <option value="newest">Newest</option>
                        <option value='oldest'>Oldest</option>
                    </select>
                    <label htmlFor="filter-select">Filter by section:</label>
                    <select id="filter-select" value={filterBy} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="sports">Sports</option>
                        <option value="business">Business</option>
                        <option value="health">Health</option>
                        <option value="briefing">Briefing</option>
                    </select>
                </div>
            </section>
            
            <section id="latest-headlines">
                <u><h2>Latest headline News from Around the Nigeria</h2></u>
                <ul id="articles-list" ref={articlesListRef} onKeyDown={handleKeyDown} tabIndex="0">
                    {currentItems.map((article, index) => (
                        <li key={index} tabIndex="0">
                            <h3>
                                <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                            </h3>
                            <div className="social-media-buttons">
                                <button onClick={() => shareOnTwitter(article.url)}>Share on Twitter</button>
                                <button onClick={() => shareOnFacebook(article.url)}>Share on Facebook</button>
                                <button onClick={() => shareOnLinkedIn(article.url)}>Share on LinkedIn</button>
                            </div>
                            {article.image_url ? (
                                <img src={article.image_url} alt="Article Thumbnail" />
                            ) : (
                                <div className="no-image">Image Not Available</div>
                            )}
                            <p>{article.description}</p>
                            <button className="ReadArticleButton play-button" onClick={() => speakText(article.title, article.description)}>
                               {isSpeaking ? "Pause Article" : "Play Article"} 
                            </button>
                            <button className="ReadArticleButton pause-button" onClick={togglePlayPause}>
                               {isSpeaking ? "Pause" : "Play"} 
                            </button>
                        </li>
                    ))}
                </ul>
                <ul id="pagination">
                    {pageNumbers.map(number => (
                        <li key={number} className={currentPage === number ? 'active' : ''}>
                            <button
                                onClick={() => paginate(number)}
                                aria-label={`Go to page ${number}`}
                                aria-current={currentPage === number ? 'page' : null}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            
            <Quiz />
            <About />
            <Contact />
            {/* Comments Section */}
            <section id="comments-section">
                <h2>Comments</h2>
                <form onSubmit={handleSubmitComment}>
                    <textarea 
                        value={newComment}
                        onChange={(event) => setNewComment(event.target.value)}
                        placeholder="Write your comment..."
                        required 
                    />
                    <button type="submit">Submit</button>
                </form>
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>{comment}</li>
                    ))}
                </ul>
            </section>
            <footer>
                <p>&copy; {new Date().getFullYear()} Ginja Tech AI News Website</p>
            </footer>
        </div>
    );
};

export default AIWebsite;
