import useSWR from "swr";

// Import useSWR from swr package

// created function to handle API Request

const fetcher = (...args) => fetch(...args).then( (res) => res.json());

const Swr = () => {
    const { data: news, error, isValidating, } = useSWR('https://newsapi.org/v2/everything?q=apple&from=2024-04-17&to=2024-04-17&sortBy=popularity&apiKey=222c46dd7a41435d87bbe0f39431eaa9', fetcher);

    // handles error and loading state
    if (error) return <div className="failed">Failed to load News</div>;
    if (!news && isValidating) return <div className="loading">Loading...</div>;
    if (!news) return <div className="no-data">No News available</div>

    return (
        <div>
            {news.articles.map((article, index) => (
                 <div key={index}> 
                    <h2>{article.title}</h2>
                    <p>{article.description}</p>
                    <a href={article.url} target="_blank" rel=" noopener noreferrer">Read More</a>
                 
                 </div>   
            ))}     
        </div>
    );
};

export default Swr;