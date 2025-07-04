'use strict';

const form = document.getElementById('form');
const feedbackMessage = document.getElementById('feedback-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            feedbackMessage.style.color = 'green';
            feedbackMessage.textContent = 'Message Added';
            form.reset();
        } else {
            feedbackMessage.style.color = 'red';
            feedbackMessage.textContent = 'Message Not Added';
        }

    } catch (error) {
        feedbackMessage.style.color = 'red';
        feedbackMessage.textContent = 'Message Not Added';
        console.error('Fetch Error:', error);
    }
});

