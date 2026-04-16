// Ensure the script runs only after the HTML document is fully loaded
jQuery(document).ready(function($) {
    
    // Select the comment input field and the submit button by their IDs
    var commentField = $("#comment");
    var submitButton = $("#submit");
    
    // Retrieve minimum and maximum character limits from localized variables (assumed from WordPress backend)
    var minChars = cl_vars.minChars;
    var maxChars = cl_vars.maxChars;

    // Check if the comment field exists on the page
    if (commentField.length) {

        // Create a new <div> element to display the character counter
        var counter = $("<div>", {
            id: "char-counter", // Set the ID for styling and reference
            css: {
                marginTop: "5px", // Space above the counter
                fontSize: "14px",
                color: "black",
                backgroundColor: "#f0f8ff",
                padding: "5px",
                border: "1px solid gray",
                borderRadius: "5px"
            },
            text: cl_vars.counterFormat.replace('%1$d', 0).replace('%2$d', maxChars)
        });

        // Create the progress bar container with a fixed height and background color
        var progressBarContainer = $("<div>", {
            css: {
                position: "relative", // Allows absolute positioning of inner elements if needed
                height: "8px",
                backgroundColor: "#ddd",
                borderRadius: "5px",
                overflow: "hidden", // Hides any overflow from the inner progress bar
                marginTop: "5px"
            }
        });
        
        // Create the progress bar inside the container, initially empty
        var progressBar = $("<div>", {
            id: "char-progress-bar", // ID for reference and styling
            css: {
                height: "100%", // Fill the container's height
                width: "0%", // Initial width of 0%, to be updated as the user types
                backgroundColor: "#4caf50", // Initial green color, changes based on character count
                transition: "width 0.3s ease" // Smooth transition effect when width changes
            }
        });

        // Append the counter and the progress bar container (with bar inside) to the page, right below the comment field
        commentField.parent().append(counter); // Adds the counter
        progressBarContainer.append(progressBar); // Adds the progress bar to its container
        commentField.parent().append(progressBarContainer); // Adds the container with the progress bar

        // Event listener for user input in the comment field
        commentField.on("input", function() {
            var charCount = commentField.val().length; // Calculate current character count
            counter.text(cl_vars.counterFormat.replace('%1$d', charCount).replace('%2$d', maxChars));
            
            // Calculate the progress percentage based on maxChars, capped at 100%
            var progressPercent = Math.min((charCount / maxChars) * 100, 100);
            progressBar.css("width", progressPercent + "%"); // Set the width of the progress bar

            // Adjust the progress bar color based on character count:
            if (charCount < minChars) {
                progressBar.css("backgroundColor", "#ff6666"); // Red if below minimum
            } else if (charCount >= minChars && charCount <= maxChars) {
                progressBar.css("backgroundColor", "#4caf50"); // Green if within limits
            } else {
                progressBar.css("backgroundColor", "#ff6666"); // Red if above maximum
            }
        });

        // Event listener for the submit button click
        submitButton.on("click", function(event) {
            var charCount = commentField.val().length; // Get the current character count
            $("#error-msg").remove(); // Remove any previous error message to prevent duplicates

            // Check if the character count is below the minimum
            if (charCount < minChars) {
                event.preventDefault(); // Prevent form submission
                
                // Create an error message for minimum character requirement
                var errorMin = $("<div>", {
                    id: "error-msg1",
                    text: cl_vars.minRequired.replace('%d', minChars),
                    css: { 
                        padding: "5px",
                        backgroundColor: "#ffe6e6", // Light red background for visibility
                        color: "red", 
                        marginTop: "5px",
                        display: "none", // Initially hidden
                        fontSize: "14px",
                        border: "1px solid red",
                        borderRadius: "5px"
                    }
                });

                // Hide the counter, show error message, then revert after 3 seconds
                counter.fadeOut(200, function() {
                    commentField.parent().append(errorMin.fadeIn(200)); // Append and fade in error
                });
                
                // After 3 seconds, fade out and remove error message, fade in counter again
                setTimeout(function() {
                    errorMin.fadeOut(200, function() {
                        $(this).remove(); // Remove error from DOM
                        counter.fadeIn(200); // Show the counter again
                    });
                }, 3000);

            // Check if the character count exceeds the maximum
            } else if (charCount > maxChars) {
                event.preventDefault(); // Prevent form submission
                
                // Create an error message for maximum character limit
                var errorMax = $("<div>", {
                    id: "error-msg2",
                    text: cl_vars.maxAllowed.replace('%d', maxChars),
                    css: { 
                        padding: "5px",
                        backgroundColor: "#ffe6e6",
                        color: "red", 
                        marginTop: "5px",
                        display: "none", // Initially hidden
                        fontSize: "14px",
                        border: "1px solid red",
                        borderRadius: "5px"
                    }
                });

                // Hide the counter, show error message, then revert after 3 seconds
                counter.fadeOut(200, function() {
                    commentField.parent().append(errorMax.fadeIn(200)); // Append and fade in error
                });

                // After 3 seconds, fade out and remove error message, fade in counter again
                setTimeout(function() {
                    errorMax.fadeOut(200, function() {
                        $(this).remove(); // Remove error from DOM
                        counter.fadeIn(200); // Show the counter again
                    });
                }, 3000);
            }
        });
    }
});