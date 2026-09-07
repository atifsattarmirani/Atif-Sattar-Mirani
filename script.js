const body=document.body;
const themeToggle=document.getElementById("themeToggle");
const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("nav");

const savedTheme=localStorage.getItem("theme");
if(savedTheme==="dark"){body.classList.add("dark");themeToggle.textContent="☀️";}

themeToggle.addEventListener("click",()=>{
  body.classList.toggle("dark");
  const dark=body.classList.contains("dark");
  themeToggle.textContent=dark?"☀️":"🌙";
  localStorage.setItem("theme",dark?"dark":"light");
});

menuBtn.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("nav a").forEach(link=>{
  link.addEventListener("click",()=>nav.classList.remove("open"));
});
document.getElementById("year").textContent=new Date().getFullYear();

function showLinkedIn(){
  alert("Please add your LinkedIn profile URL in index.html before submitting your portfolio.");
}
