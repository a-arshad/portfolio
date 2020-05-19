/* eslint-disable new-cap */
window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const engine = new BABYLON.Engine(canvas, true);
    let camera;

    const createScene = function() {
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3.White();
        engine.enableOfflineSupport = false;


        //const box = BABYLON.Mesh.CreateBox('Box', 4, scene);

        camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -15), scene);
        camera.attachControl(canvas, true);

        new BABYLON.PointLight('light', new BABYLON.Vector3(5, 10, -5), scene);

        BABYLON.SceneLoader.ImportMesh(
            '',
            './../models/',
            'WoodSurface.babylon',
            scene,
            function(newMeshes) {
                newMeshes.forEach(function(mesh) {
                    mesh.rotation = new BABYLON.Vector3(
                        BABYLON.Tools.ToRadians(45),
                        BABYLON.Tools.ToRadians(45),
                        BABYLON.Tools.ToRadians(45));
                });
            },
            null,
            function(scene, message, e) {
                console.log(message);
            });

        return scene;
    };

    const animateCameraPositionAndRotation = function(freeCamera,
        fromPosition,
        toPosition,
        fromRotation,
        toRotation) {
        const easingFunction = new BABYLON.CubicEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_OUT);

        const animCamPosition = new BABYLON.Animation('animCam', 'position', 30,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        const keysPosition = [];
        keysPosition.push({
            frame: 0,
            value: fromPosition,
        });
        keysPosition.push({
            frame: 60,
            value: toPosition,
        });

        animCamPosition.setKeys(keysPosition);

        const animCamRotation = new BABYLON.Animation('animCam', 'rotation', 30,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        const keysRotation = [];
        keysRotation.push({
            frame: 0,
            value: fromRotation,
        });
        keysRotation.push({
            frame: 60,
            value: toRotation,
        });

        animCamRotation.setKeys(keysRotation);

        animCamPosition.setEasingFunction(easingFunction);
        animCamRotation.setEasingFunction(easingFunction);
        freeCamera.animations.push(animCamPosition);
        freeCamera.animations.push(animCamRotation);

        scene.beginAnimation(freeCamera, 0, 60, false);
    };

    const scene = createScene();
    let once = true;
    engine.runRenderLoop(function() {
        scene.render();
        if (once) {
            console.log('animate');
            animateCameraPositionAndRotation(camera, camera.position, new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z + 11), camera.rotation, new BABYLON.Vector3(camera.rotation.x + BABYLON.Tools.ToRadians(45), camera.rotation.y, camera.rotation.z));
        }
        once = false;
    });
});


