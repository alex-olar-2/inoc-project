function detectHandGesture(landmarks) {
    const thumbTip = landmarks[4], indexTip = landmarks[8];
    const middleTip = landmarks[12], ringTip = landmarks[16], pinkyTip = landmarks[20];

    const isIndexUp = indexTip.y < landmarks[6].y;
    const isMiddleUp = middleTip.y < landmarks[10].y;
    const isRingUp = ringTip.y < landmarks[14].y;
    const isPinkyUp = pinkyTip.y < landmarks[18].y;

    const pinchDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
    if (pinchDist < 0.05) return { text: "🤙 Pinch", className: "pinch" };

    if (!isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
        if (thumbTip.y < landmarks[5].y - 0.05) return { text: "👍 Thumbs Up", className: "thumbsup" };
        return { text: "✊ Fist", className: "fist" };
    }
    if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp) return { text: "🖐️ Open Palm", className: "palm" };
    if (isIndexUp && isMiddleUp && !isRingUp && !isPinkyUp) return { text: "✌️ Peace / V", className: "peace" };
    if (isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) return { text: "👆 Point", className: "point" };

    return { text: "Niciun gest clar", className: "none" };
}

function initHandsModel(canvasCtx, canvasElement, gestureOutput, getCurrentMode) {
    const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
    
    hands.onResults((results) => {
        if (getCurrentMode() !== 'hands') return;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
            drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 4 });

            const gesture = detectHandGesture(landmarks);
            gestureOutput.innerText = gesture.text;
            gestureOutput.className = gesture.className;
        } else {
            gestureOutput.innerText = "Arată o mână..."; 
            gestureOutput.className = "none";
        }
        canvasCtx.restore();
    });
    
    return hands;
}
