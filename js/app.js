document.addEventListener("DOMContentLoaded", () => {
    const videoElement  = document.getElementById('input-video');
    const canvasElement = document.getElementById('output-canvas');
    const canvasCtx     = canvasElement.getContext('2d');
    const gestureOutput = document.getElementById('gesture-output');

    let currentMode = 'hands';
    const getCurrentMode = () => currentMode;

    // Inițializare modele
    const handsModel    = initHandsModel(canvasCtx, canvasElement, gestureOutput, getCurrentMode);
    const faceMeshModel = initFaceModel(canvasCtx, canvasElement, gestureOutput, getCurrentMode);

    // Inițializare cameră
    initCamera(videoElement, handsModel, faceMeshModel, getCurrentMode);

    // Inițializare UI casă
    HomeUI.update();

    // Switch mod detecție
    document.querySelectorAll('input[name="mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentMode = e.target.value;
            HomeController.clearBuffer();
            HomeUI.resetConfirm('Mod schimbat. Arată un gest...');
            gestureOutput.innerText = currentMode === 'hands' ? 'Arată o mână...' : 'Așează-te în fața camerei...';
            gestureOutput.className = 'gesture-output none';
        });
    });
});
