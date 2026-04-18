function initCamera(videoElement, handsModel, faceMeshModel, getCurrentMode) {
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            const mode = getCurrentMode();
            if (mode === 'hands') {
                await handsModel.send({ image: videoElement });
            } else if (mode === 'face') {
                await faceMeshModel.send({ image: videoElement });
            }
        },
        width: 640, 
        height: 480
    });

    camera.start().catch(err => console.error("Eroare la pornirea camerei:", err));
    return camera;
}
