/* Tabs Logic */
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-panel').forEach(p=>p.style.display='none');
    if(tab === 'overview') document.getElementById('overview').style.display = 'block';
    if(tab === 'experience') document.getElementById('experience').style.display = 'block';
    if(tab === 'projects') document.getElementById('projects-panel').style.display = 'block';
  });
});

/* Scroll Reveal */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries, observer)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.12});
reveals.forEach(el=> obs.observe(el));

/* Avatar fallback */
document.querySelectorAll('.avatar img').forEach(img=>{
  img.addEventListener('error', ()=> {
    img.style.display='none';
    img.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:900;color:#061023;background:linear-gradient(135deg,var(--neon-purple),var(--neon-blue));border-radius:999px;font-size:40px">MK</div>';
  });
});
