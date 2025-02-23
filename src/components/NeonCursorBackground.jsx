import { useEffect } from 'react';
import { neonCursor } from 'threejs-toys';

const NeonCursorBackground = () => {
  useEffect(() => {
    neonCursor({
      el: document.getElementById('app'),
      shaderPoints: 16,
      curvePoints: 80,
      curveLerp: 0.5,
      radius1: 5,
      radius2: 30,
      velocityTreshold: 10,
      sleepRadiusX: 70,
      sleepRadiusY: 70,
      sleepTimeCoefX: 0.0025,
      sleepTimeCoefY: 0.0025,
    });
  }, []);

  return (
    <div id="app" className="absolute w-full h-full  overflow-hidden touch-pan-up">
    </div>
  );
};

export default NeonCursorBackground;