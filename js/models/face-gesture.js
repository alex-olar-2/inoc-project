function detectFaceGesture(landmarks) {
    const leftEyeDist = Math.abs(landmarks[159].y - landmarks[145].y);
    const rightEyeDist = Math.abs(landmarks[386].y - landmarks[374].y);
    const mouthTop = landmarks[13], mouthBottom = landmarks[14];
    const mouthLeft = landmarks[61], mouthRight = landmarks[291];

    const mouthOpenDist = Math.abs(mouthTop.y - mouthBottom.y);

    const isBlink = (leftEyeDist < 0.015 && rightEyeDist < 0.015);
    const isMouthOpen = mouthOpenDist > 0.05;
    const isHappy = mouthLeft.y < mouthTop.y && mouthRight.y < mouthTop.y;
    const isSad = mouthLeft.y > mouthBottom.y + 0.015 && mouthRight.y > mouthBottom.y + 0.015;

    if (isBlink) return { text: "😑 Blink (Clipire)", className: "blink" };
    if (isMouthOpen) return { text: "😲 Surprised (Gură deschisă)", className: "surprised" };
    if (isHappy) return { text: "😄 Happy (Zâmbet)", className: "happy" };
    if (isSad) return { text: "😢 Sad (Tristețe)", className: "sad" };

    return { text: "😐 Neutru", className: "none" };
}

function initFaceModel(canvasCtx, canvasElement, gestureOutput, getCurrentMode) {
    const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
    
    faceMesh.onResults((results) => {
        if (getCurrentMode() !== 'face') return;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];

            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#FF0000', lineWidth: 2 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#30FF30', lineWidth: 2 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#30FF30', lineWidth: 2 });

            const gesture = detectFaceGesture(landmarks);
            gestureOutput.innerText = gesture.text;
            gestureOutput.className = gesture.className;
        } else {
            gestureOutput.innerText = "Așează-te în fața camerei..."; 
            gestureOutput.className = "none";
        }
        canvasCtx.restore();
    });

    return faceMesh;
}
