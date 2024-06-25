import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { FiMenu } from "react-icons/fi"; // Import Feather Menu Icon
import './src/styles/FloatingActionButton.css';

const FloatingActionButton = () => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate(); // use the useNavigate to get the navigation function

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const handleMenuClick = (category) => {
        console.log("Menu Item Clicked:", category);
        // Navigate to the corresponding category route
        navigate(`/articles/${category}`);
        // Also close the menu after clicking an item
        setExpanded(false);   
    };


    return (
        <div className={`fab-container ${expanded ? "expanded" : ""}`}>
            <IconButton className="fab-button" onClick={toggleExpanded}>
                <FiMenu /> {/*Using Feather Menu Icon*/}
            </IconButton>
            <List className="fab-menu">
                <ListItem button onClick={ ()=> handleMenuClick("home")}>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={ ()=> handleMenuClick("news")}>
                    <ListItemText primary="News" />
                </ListItem>
                <ListItem button onClick={ ()=> handleMenuClick("business") }>
                    <ListItemText primary="Business" />
                </ListItem>
                <ListItem button onClick={ ()=> handleMenuClick("sports") }>
                    <ListItemText primary="Sports" />
                </ListItem>
            </List>
        </div>
    );
};

export default FloatingActionButton;