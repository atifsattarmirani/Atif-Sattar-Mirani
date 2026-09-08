const body=document.body,theme=document.getElementById("theme"),menu=document.getElementById("menu"),links=document.getElementById("links");
if(localStorage.getItem("theme")==="dark"){body.classList.add("dark");theme.textContent="☀"}
theme.onclick=()=>{body.classList.toggle("dark");localStorage.setItem("theme",body.classList.contains("dark")?"dark":"light");theme.textContent=body.classList.contains("dark")?"☀":"☾"};
menu.onclick=()=>links.classList.toggle("open");
links.querySelectorAll("a").forEach(a=>a.onclick=()=>links.classList.remove("open"));
document.getElementById("year").textContent=new Date().getFullYear();
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("show")}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(x=>obs.observe(x));
const glow=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});
