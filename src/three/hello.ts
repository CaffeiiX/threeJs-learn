import * as THREE from "three";
import { Vector3 } from "three";

export default () => {
    let scene = new THREE.Scene();
    /**
     * 创建网格模型
     */
    // let geometry = new THREE.SphereGeometry(60, 40, 40); //创建一个球体几何对象
    let geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
    let material = new THREE.MeshLambertMaterial({
        color: 0x0000ff
    }); //材质对象Material
    let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    scene.add(mesh); //网格模型添加到场景中
    /**
     * 光源设置
     */
    //点光源
    let point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    scene.add(point); //点光源添加到场景中
    //环境光
    let ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);
    // console.log(scene)
    // console.log(scene.children)
    /**
     * 相机设置
     */
    let width: number = window.innerWidth; //窗口宽度
    let height: number = window.innerHeight; //窗口高度
    let k: number = width / height; //窗口宽高比
    let s: number= 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    let camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(200, 300, 200); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
    /**
     * 创建渲染器对象
     */
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);//设置渲染区域尺寸
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
    //执行渲染操作   指定场景、相机作为参数
    // 无限执行动画旋转效果，指定增加旋转度数
    // render(renderer, mesh, scene, camera);
    // 指定旋转一圈的时间 duration 仅仅执行一次
    animate({
        duration: 10000,
        timing: (props: any) => {
            return props * Math.PI * 2;
        },
        draw: (props: any) =>{
            renderer.render(scene, camera);
            mesh.setRotationFromAxisAngle(new Vector3(0,1,0), props);
        }
    })
}
const render = (renderer: THREE.WebGLRenderer, mesh: THREE.Mesh, scene: THREE.Scene, camera: THREE.Camera) => {
    requestAnimationFrame(function render(){
        renderer.render(scene, camera);
        mesh.rotateY(0.01);
        requestAnimationFrame(render);
    });
}
interface animateProps {
    timing: Function,
    draw: Function,
    duration: number
}
const animate = function ({timing, draw, duration}: animateProps) {
    let start = performance.now();
    requestAnimationFrame(function animate(time){
        let timeFraction = (time - start) / duration;
        if(timeFraction > 1) timeFraction = 1;
        let progress = timing(timeFraction);
        draw(progress);
        if(timeFraction < 1){
            requestAnimationFrame(animate);
        }
    })
}