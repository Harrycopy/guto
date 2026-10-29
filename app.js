(() => {
  const VIDEOS = [
    ["JUR 06", "1CZSH-HhjF6NZKaw2Zu1zjSN4iY9Qf6L_", "Barbearia de bairro não cresce?", "1377222497909358"],
    ["JUR 16", "1HSw8BXg-kNNABwQeUvzpy-pcHD7EPRfi", "Você não é dono, você é funcionário da sua própria barbearia.", "1285649593506312"],
    ["JUR 12", "1WloFngG49kwtgVH2meLicoL5oH71MKEr", "120 mil com apenas 5 barbeiros.", "2308067799965745"],
    ["JUR 10", "1tMCQXGdSGbhUdmeYdumtLpKzbvzOqtbs", "Todo dono de barbearia diz que quer crescer, mas poucos encaram a verdade.", "1674990123589306"],
    ["JUR 13", "1NbcTdsF4RBapN5VuKY-Wn842bfZK7SSn", "Se a sua barbearia fatura até 30 mil por mês, eu posso te ajudar.", "1501594418666130"],
    ["JUR 08", "1jqjAIgyArvPVx7CDNGrCHPCmDGcD-N_J", "100 mil por mês com apenas 40 metros quadrados.", "2696015324162327"],
    ["MOL 07", "1O8lmpQbZgiafloAOJjsPmtbUvhDwkOoJ", "Eu nunca cortei um cabelo.", "1394188109487132"],
    ["MOL 05", "1N3ePpDQ7U6H-F7v1e-FREEilFK-4bloy", "Eu sou o dono da barbearia e trabalho mais que todo mundo.", "1429393072475182"],
    ["MOL 09", "1DnXikdinDOF9L6g3vW58M4mTeoQX9yp9", "Barbearia não passa de 100 mil só porque tem mais clientes.", "1819905079003329"],
    ["MOL 10", "1kqpKxFChLAxxuo1Ik_eaAZZoASNUQgzm", "Meus barbeiros não fazem o que eu peço.", "1099876882561044"],
    ["BF 11", "1H5QywLyvNVooKhte4SR-PVnTzPKFOx9z", "Você é barbeiro ou empregado da sua própria barbearia?", "1802452711205194"],
    ["BF 09", "1BkLaH9GMjY-rceiK0SFkzTyTztH4pW_d", "Você não precisa de mais clientes.", "1510890427393447"],
    ["BF 06", "1J1oxMkUWeAn768atRfSyXkD3OfJh23m-", "Monta o top 5 dos métodos de controle financeiro.", "1064582366423868"],
    ["BF 13", "1LqfnD88kZlfVqfZ0bH-2u9MjjqhyJLQM", "Você tá gastando 5 horas por mês numa planilha.", "1063470313133003"],
    ["BF 02", "1IvWI-ga9APrAvhlIoF1QiN-N7YeioIt-", "Qual o melhor app financeiro para barbearia?", "1273629922508852"]
  ];

  // mural
  const wall = document.getElementById("wall");
  if (wall) {
    wall.innerHTML = VIDEOS.map(([code, id, hook, ad]) => `
      <button class="vid reveal" type="button" data-embed="https://drive.google.com/file/d/${id}/preview" data-title="${code} · anúncio ${ad}" data-link="https://www.facebook.com/ads/library/?id=${ad}">
        <img loading="lazy" alt="" src="https://drive.google.com/thumbnail?id=${id}&sz=w480" onerror="this.style.display='none'">
        <span class="play" aria-hidden="true">▶</span>
        <span class="meta"><span class="code">${code}</span><span class="hook">${hook}</span></span>
      </button>`).join("");
  }

  // modal
  const modal = document.getElementById("modal");
  const box = document.getElementById("modal-box");
  const frame = document.getElementById("modal-frame");
  const title = document.getElementById("modal-title");
  const link = document.getElementById("modal-link");
  let lenis = null;
  const open = (btn) => {
    const src = btn.dataset.embed;
    box.classList.toggle("wide", !!btn.dataset.wide);
    title.textContent = btn.dataset.title || "";
    link.href = btn.dataset.link || src;
    link.textContent = btn.dataset.link ? "ver o anúncio na Biblioteca ↗" : "abrir em nova aba ↗";
    frame.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${title.textContent}"></iframe>`;
    modal.hidden = false;
    if (lenis) lenis.stop();
    document.getElementById("modal-close").focus();
  };
  const close = () => { modal.hidden = true; frame.innerHTML = ""; if (lenis) lenis.start(); };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-embed]");
    if (b) { e.preventDefault(); open(b); return; }
    if (e.target === modal || e.target.id === "modal-close") close();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });

  // animação
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.gsap || reduce) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);

  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      const el = document.querySelector(a.getAttribute("href"));
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -20 }); }
    }));
  }

  document.fonts.ready.then(() => {
    // títulos
    document.querySelectorAll(".split").forEach((el, i) => {
      const s = SplitText.create(el, { type: "lines,words", mask: "lines" });
      const inHero = el.closest(".hero");
      gsap.from(s.words, {
        yPercent: 110, duration: inHero ? 1.1 : 0.9, ease: "expo.out", stagger: inHero ? 0.035 : 0.02,
        delay: inHero ? 0.15 : 0,
        scrollTrigger: inHero ? null : { trigger: el, start: "top 85%" }
      });
    });

    // revelação
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });

    // contadores
    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = +el.dataset.count; const o = { v: 0 };
      gsap.to(o, { v: end, duration: 2, ease: "power2.out", delay: 0.6, onUpdate: () => { el.textContent = Math.round(o.v); } });
    });

    // poste
    gsap.to(".pole", { yPercent: 18, rotate: 6, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.from(".pole", { scaleY: 0, transformOrigin: "top", duration: 1.4, ease: "expo.out" });

    // barras
    gsap.utils.toArray(".fill").forEach((el) => {
      gsap.from(el, { scaleX: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%" } });
    });

    // horizontal
    const mm = gsap.matchMedia();
    mm.add("(min-width: 761px)", () => {
      const track = document.querySelector(".hs-track");
      const sec = document.querySelector("#quem");
      if (!track || !sec) return;
      const dist = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 }
      });
    });

    // seção do Guto entra crescendo
    gsap.from(".guto", { scale: 0.94, borderRadius: 60, ease: "none", scrollTrigger: { trigger: ".guto", start: "top bottom", end: "top 30%", scrub: true } });

    ScrollTrigger.refresh();
  });
})();
