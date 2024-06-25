import React from "react";
import './src/styles/Contact.css';

const Contact = () => {
    return(
       <div className="contact-container">
            <h2>Contact Us</h2>
            <p>If you have any questions, suggestions, or feedback, feel free to reach out to us:</p>
            <ul>
                <li>Email: info@ginjatech.com</li>
                <li>Phone: +234 567 7890</li>
                <li>123 AI Street, City, Country</li>
            </ul>
       </div>
    );
};

export default Contact;