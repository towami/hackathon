import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// Scene, Camera, and Renderer Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 70;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load OBJ Models
const loader = new OBJLoader();
let fencingMask;

// Get the button element

// Add a scroll event listener to hide the button when scrolling starts
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        guardianButton.classList.add('hidden'); // Hide the button
    } else {
        guardianButton.classList.remove('hidden'); // Show the button
    }
});

// Get the modal, buttons, and input field
const popupModal = document.getElementById('popupModal');
const guardianButton = document.getElementById('guardianButton');
const sendProposalButton = document.getElementById('sendProposalButton');
const closeModalButton = document.getElementById('closeModalButton');
const emailField = document.getElementById('emailField');

// Show the modal when "Become a Guardian" is clicked
guardianButton.addEventListener('click', () => {
    popupModal.classList.add('visible');
});

// Hide the modal when "Close" is clicked
closeModalButton.addEventListener('click', () => {
    popupModal.classList.remove('visible');
});



// Load Fencing Mask
loader.load(
    '/11724_helmet_v1_L3.obj', // Replace with your actual OBJ file path
    (object) => {
        fencingMask = object;

        // Center the object's geometry
        fencingMask.traverse((child) => {
            if (child.isMesh) {
                child.geometry.computeBoundingBox();
                const boundingBox = child.geometry.boundingBox;
                const center = new THREE.Vector3();
                boundingBox.getCenter(center);
                child.geometry.translate(-center.x - 0.4, -center.y, -center.z);

                // Apply material
                child.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
            }
        });

        // Set object transformations
        fencingMask.position.set(0, 94, 0); // Adjusted y-position to 80 (10 units lower from 90)
        fencingMask.scale.set(5, 5, 5); // Uniform scaling
        scene.add(fencingMask);

        // Update camera to look at the object position
        camera.lookAt(fencingMask.position);
    },
    (xhr) => {
        console.log(`Fencing Mask loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('Error loading fencing mask:', error);
    }
);



function animate() {
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Define sections
const sections = [
    { title: "GUARDIANS OF ARCHIVES", content: "" },
    {
        title: "Fencing Mask",
        content: "",
        // content: "This is the fencing mask model in 3D.",
        video: true // Mark that this section includes a video
    }
];

const sectionContainer = document.getElementById('section-container');

let currentSectionIndex = 0;

// Create a video element
const videoElement = document.createElement('video');
videoElement.src = '/AI video enhanced.mp4'; // Replace with your video file path
videoElement.loop = true; // Enable looping
videoElement.muted = true; // Mute if necessary
videoElement.style.position = 'fixed';
videoElement.style.top = '56%';
videoElement.style.left = '50%';
videoElement.style.transform = 'translate(-50%, -50%)';
videoElement.style.width = '25%';
videoElement.style.height = 'auto';
videoElement.style.display = 'none'; // Initially hidden
videoElement.style.zIndex = '2'; // Ensure video is above canvas
document.body.appendChild(videoElement);

// Prevent the user from pausing the video
videoElement.addEventListener('pause', () => {
    videoElement.play(); // Automatically play if paused
});

// Adjust scroll ranges for animation and sections
const totalScrollHeight = document.body.scrollHeight - window.innerHeight;
const animationScrollHeight = totalScrollHeight * 0.4; // 40% of total scroll for zoom animation
const sectionScrollHeight = (totalScrollHeight - animationScrollHeight) / (sections.length - 1); // Remaining scroll divided among sections

let emailSubmitted = false; // Flag to track if the email has been submitted

// Scroll Event Listener for Zoom Animation and Section Transitions
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Zoom animation phase
    if (scrollY < animationScrollHeight) {
        const scrollFraction = scrollY / animationScrollHeight;
        camera.position.z = 70 - scrollFraction * 69;

        // Dynamically update the camera's `lookAt` target
        if (fencingMask) {
            camera.lookAt(fencingMask.position); // Ensure camera continuously points at the object
        }
    }

    // Calculate the current section index based on scroll position
    const sectionOffsetY = scrollY - animationScrollHeight;
    const sectionIndex = Math.min(
        Math.floor(sectionOffsetY / sectionScrollHeight) + 1,
        sections.length - 1
    );

    // Update section content only if the section index changes
    if (sectionIndex !== currentSectionIndex) {
        currentSectionIndex = sectionIndex;
        const { title, content, video } = sections[sectionIndex];
        sectionContainer.innerHTML = `<h1 class="bokor-regular">${title}</h1><p>${content}</p>`;

        // Show or hide the video based on the current section
        if (video && sectionIndex === 1) {
            videoElement.style.display = 'block';
            videoElement.play();
        } else {
            videoElement.style.display = 'none';
            videoElement.pause();
        }
    }

    // Manage additional sections visibility based on the current section
    if (sectionIndex === 1) {
        // When in the "Fencing Mask" section, hide additional sections
        if (additionalSectionsVisible) {
            console.log('Hiding additional sections...');
            hideAdditionalSections();
        }
    } else if (sectionIndex === 0) {
        // When in "GUARDIANS OF ARCHIVES" section, show additional sections if email was submitted
        if (!additionalSectionsVisible && emailSubmitted) {
            console.log('Showing additional sections...');
            createAdditionalSections();
        }
    }
});


// Button click event
sendProposalButton.addEventListener('click', () => {
    console.log('Send Proposal button clicked.');
    const email = emailField.value.trim();
    if (email) {
        alert(`Proposal sent to ${email}!`);
        popupModal.classList.remove('visible');
        emailField.value = '';
        createAdditionalSections();
        emailSubmitted = true; // Mark email as submitted
    } else {
        alert('Please provide a valid email address.');
    }
});

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});



const additionalSections = [
    { title: "Get 3D assets", content: "", link: "getAssets.html" },
    { title: "Get your badge", content: "", link: "getBadge.html" },
    { title: "Download pattern", content: "", link: "downloadPattern.html" },
    { title: "Explore in VR", content: "", link: "exploreinvr.html" },
];


let additionalSectionsVisible = false; // Flag to track if additional sections are visible
let sectionWrapper; // Store the section wrapper globally

function createAdditionalSections() {
    if (!sectionWrapper) {
        sectionWrapper = document.createElement('div');
        sectionWrapper.id = "additionalSections";
        sectionWrapper.style.position = "fixed";
        sectionWrapper.style.top = "0";
        sectionWrapper.style.left = "0";
        sectionWrapper.style.width = "100%";
        sectionWrapper.style.height = "100%";
        sectionWrapper.style.pointerEvents = "none";
        sectionWrapper.style.visibility = "hidden";
        sectionWrapper.style.opacity = "0";
        sectionWrapper.style.transition = "visibility 0s, opacity 0.5s ease";
        document.body.appendChild(sectionWrapper);

        const sectionPositions = [
            { x: -450, y: -180 },
            { x: -450, y: 180 },
            { x: 450, y: -180 },
            { x: 450, y: 180 },
        ];

        additionalSections.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('extra-section');
            sectionDiv.style.position = "absolute";
            sectionDiv.style.backgroundColor = "black";
            sectionDiv.style.color = "white";
            sectionDiv.style.padding = "10px";
            sectionDiv.style.boxShadow = "0px 0px 15px white";
            sectionDiv.style.borderRadius = "8px";
            sectionDiv.style.textAlign = "center";
            sectionDiv.style.pointerEvents = "auto";

            // Create the anchor element for redirection
            const anchor = document.createElement('a');
            anchor.href = section.link;
            anchor.style.textDecoration = "none";
            anchor.style.color = "white";

            // Add title and content inside the anchor
            anchor.innerHTML = `<h2>${section.title}</h2><p>${section.content}</p>`;
            sectionDiv.appendChild(anchor);

            // Position the section
            const x = window.innerWidth / 2 + sectionPositions[index].x;
            const y = window.innerHeight / 2 + sectionPositions[index].y;
            sectionDiv.style.left = `${x}px`;
            sectionDiv.style.top = `${y}px`;
            sectionDiv.style.transform = "translate(-50%, -50%)";
            sectionWrapper.appendChild(sectionDiv);
        });
    }

    sectionWrapper.style.visibility = "visible";
    sectionWrapper.style.opacity = "1";
    additionalSectionsVisible = true;
}

// Function to hide additional sections
function hideAdditionalSections() {
    if (sectionWrapper) {
        sectionWrapper.style.visibility = "hidden";
        sectionWrapper.style.opacity = "0";
        additionalSectionsVisible = false;
    }
}