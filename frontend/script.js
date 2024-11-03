document.addEventListener('DOMContentLoaded', () => {
  let fromValue=""
  let toValue=""
  let longNegative=""
    // Handle image upload
    const uploadButton = document.querySelector('.upbutton');
    uploadButton.addEventListener('click', () => uploadImage());

    // Handle chat message submission
    const chatButton = document.getElementById('chatButton');
    chatButton.addEventListener('click', () => sendMessage());

    // Handle form submission for user details
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        submitUserDetails();
    });

    // Function to upload an image
    async function uploadImage() {

        if(!longNegative||!toValue||!fromValue){
            alert("please fill the form first and then input the image!")
            return;

        }
        const form = document.getElementById('uploadForm');
        const formData = new FormData(form);
        formData.append("fromValue",fromValue);
        formData.append("toValue",toValue);
        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.transformedUrl) {
                document.getElementById('output').innerHTML = `
                    <img src="${data.transformedUrl}" alt="Transformed Image" />
                `;
            } else {
                alert(data.error || 'Error transforming image');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to upload image. Please try again.');
        }
    }

    // Function to submit user details and generate prompts
    async function submitUserDetails() {
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const description = document.getElementById('description').value;

        const prompt = `My name is ${name}, I am ${age} years old, and here’s a bit about me: ${description}`;

        try {
            const response = await fetch('http://localhost:3000/prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();

            if (data.negativePrompt && data.longNegativePrompt) {
                longNegative=data.longNegativePrompt;
                fromValue=data.realPrompt;
                toValue=data.negativePrompt;
                displayPromptResults(longNegative,fromValue,toValue);
                

            } else {
                alert(data.error || 'Error generating prompts');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate prompts. Please try again.');
        }
    }

    // Function to display generated prompts
    function displayPromptResults(longNegative, negativePrompt,realPrompt) {
        const outputDiv = document.createElement('div');
        outputDiv.classList.add('output-container');

        outputDiv.innerHTML = `
            <h3 style="color: white; ">Generated Prompts:</h3>
            <p style="color: white; " ><strong>Alternative Traits:</strong> ${longNegative}</p>
         

        `;

        document.body.appendChild(outputDiv);
    }

    // Function to send a chat message and receive a response
    async function sendMessage() {
        const message = document.getElementById('messageInput').value;
        const identity =longNegative;
        if (!toValue||!longNegative||!toValue) {
            alert('Please fill the from first and then upload image and then do chat!');
            return;
        }
        if (!message ||!identity) {
            alert('Please fill in both fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, identity })
            });

            const data = await response.json();

            if (data.response) {
                
                document.getElementById('chatOutput').innerText = data.response;
            } else {
                alert(data.error || 'Error generating response');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate chat response. Please try again.');
        }
    }
});
