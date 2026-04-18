document.addEventListener("DOMContentLoaded", () => {
    const videoElement = document.getElementById('input-video');
    const canvasElement = document.getElementById('output-canvas');
    const canvasCtx = canvasElement.getContext('2d');
    const gestureOutput = document.getElementById('gesture-output');
    
    let currentMode = 'hands'; 

    const getCurrentMode = () => currentMode;

    // Inițializare Modele
    const handsModel = initHandsModel(canvasCtx, canvasElement, gestureOutput, getCurrentMode);
    const faceMeshModel = initFaceModel(canvasCtx, canvasElement, gestureOutput, getCurrentMode);

    // Inițializare Cameră
    initCamera(videoElement, handsModel, faceMeshModel, getCurrentMode);

    // Setup event listeners pentru radio buttons
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentMode = e.target.value;
            gestureOutput.innerText = `Mod schimbat pe: ${currentMode === 'hands' ? 'Mâini' : 'Față'}. Așteaptă...`;
            gestureOutput.className = "none text-center w-100";
        });
    });
});
