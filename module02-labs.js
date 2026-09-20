(() => {
  const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
  const mse = (a, b) => mean(a.map((x, i) => (x - b[i]) ** 2));
  const gini = y => {
    if (!y.length) return 0;
    const counts = {};
    y.forEach(v => counts[v] = (counts[v] || 0) + 1);
    return 1 - Object.values(counts).reduce((s, c) => s + (c / y.length) ** 2, 0);
  };
  const esc = v => String(v ?? "").replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));

  function regression(root) {
    const pts = Array.from({length:24}, (_, i) => {
      const x = -3 + i * 0.26;
      return {x, y: 1.8 * x + 0.7 + Math.sin(i * 1.73 + 7) * 0.32};
    });
    const range = root.querySelector("[data-m2-range]");
    const value = root.querySelector("[data-m2-value]");
    const svg = root.querySelector("[data-m2-plot]");
    const metrics = root.querySelector("[data-m2-metrics]");
    const reveal = root.querySelector("[data-m2-reveal]");
    const result = root.querySelector("[data-m2-result]");
    const predictX = root.querySelector("[data-m2-prediction]");
    const guessY = root.querySelector("[data-m2-answer]");

    function run(show) {
      const lambda = Number(range.value);
      value.textContent = lambda.toFixed(1);
      let sxx=0, sx=0, sy=0, sxy=0;
      pts.forEach(p => { sxx += p.x*p.x; sx += p.x; sy += p.y; sxy += p.x*p.y; });
      const n=pts.length, a=sxx+lambda, b=sx, c=sx, d=n;
      const det=a*d-b*c;
      const w=(sxy*d-b*sy)/det;
      const intercept=(a*sy-c*sxy)/det;
      const train=pts.slice(0,18), test=pts.slice(18);
      const tp=train.map(p=>w*p.x+intercept), ep=test.map(p=>w*p.x+intercept);
      const trainM=mse(train.map(p=>p.y),tp), testM=mse(test.map(p=>p.y),ep);
      const W=620,H=280,x0=-3.2,x1=3.2,y0=-6,y1=7;
      const px=x=>28+(x-x0)/(x1-x0)*560, py=y=>H-24-(y-y0)/(y1-y0)*232;
      svg.innerHTML=pts.map(p=>'<circle cx="'+px(p.x).toFixed(1)+'" cy="'+py(p.y).toFixed(1)+'" r="4" fill="currentColor"/>').join("")+
        '<line x1="'+px(x0)+'" y1="'+py(w*x0+intercept)+'" x2="'+px(x1)+'" y2="'+py(w*x1+intercept)+'" stroke="currentColor" stroke-width="3"/>';
      metrics.innerHTML='<div class="m2-metric"><span>Train MSE</span><strong>'+trainM.toFixed(3)+'</strong></div>'+
        '<div class="m2-metric"><span>Holdout MSE</span><strong>'+testM.toFixed(3)+'</strong></div>'+
        '<div class="m2-metric"><span>Slope</span><strong>'+w.toFixed(3)+'</strong></div>';
      if (!show) {
        result.textContent="Predict first. Then reveal the fitted model and measured holdout behavior.";
        return;
      }
      const xq=Number(predictX.value);
      const guess=Number(guessY.value);
      const target=1.8*xq+0.7+Math.sin(23*1.73+7)*0.32;
      const pred=w*xq+intercept;
      result.textContent="Model prediction "+pred.toFixed(3)+", synthetic target "+target.toFixed(3)+", your absolute prediction error "+Math.abs(guess-target).toFixed(3)+". Holdout MSE "+testM.toFixed(3)+".";
    }
    range.addEventListener("input",()=>run(false));
    reveal.addEventListener("click",()=>run(true));
    run(false);
  }

  function trees(root) {
    const x=[-2.7,-2.1,-1.6,-1.1,-.7,-.3,.2,.6,1,1.4,1.8,2.3,2.8];
    const y=[0,0,0,0,0,1,1,0,1,1,1,1,1];
    const range=root.querySelector("[data-m2-range]"), value=root.querySelector("[data-m2-value]");
    const svg=root.querySelector("[data-m2-plot]"), metrics=root.querySelector("[data-m2-metrics]");
    const reveal=root.querySelector("[data-m2-reveal]"), result=root.querySelector("[data-m2-result]");
    function run(show){
      const t=Number(range.value); value.textContent=t.toFixed(1);
      const L=y.filter((_,i)=>x[i]<=t), R=y.filter((_,i)=>x[i]>t);
      const weighted=(L.length*gini(L)+R.length*gini(R))/y.length;
      const gain=gini(y)-weighted;
      const px=v=>35+(v+3)/6*550;
      svg.innerHTML='<line x1="35" y1="185" x2="585" y2="185" stroke="currentColor" opacity=".25"/>'+
        x.map((v,i)=>'<circle cx="'+px(v)+'" cy="'+(y[i]?80:150)+'" r="6" fill="'+(v<=t?'currentColor':'none')+'" stroke="currentColor"/>').join("")+
        '<line x1="'+px(t)+'" y1="30" x2="'+px(t)+'" y2="190" stroke="currentColor" stroke-width="3" stroke-dasharray="6 5"/>';
      metrics.innerHTML='<div class="m2-metric"><span>Parent Gini</span><strong>'+gini(y).toFixed(3)+'</strong></div>'+
        '<div class="m2-metric"><span>Weighted child impurity</span><strong>'+weighted.toFixed(3)+'</strong></div>'+
        '<div class="m2-metric"><span>Impurity reduction</span><strong>'+gain.toFixed(3)+'</strong></div>';
      result.textContent=show?"Measured impurity reduction is "+gain.toFixed(3)+" at threshold "+t.toFixed(1)+".":"Choose a threshold and predict which split reduces impurity most.";
    }
    range.addEventListener("input",()=>run(false)); reveal.addEventListener("click",()=>run(true)); run(false);
  }

  function clustering(root) {
    const base=[[-2.4,-.8],[-2,-.4],[-1.8,.1],[-2.3,.5],[-1.3,-.2],[-1.6,.7],[1.5,-.7],[1.9,-.2],[2.4,.1],[1.7,.5],[2.2,.8],[2.7,.2]];
    const range=root.querySelector("[data-m2-range]"), value=root.querySelector("[data-m2-value]");
    const svg=root.querySelector("[data-m2-plot]"), metrics=root.querySelector("[data-m2-metrics]");
    const reveal=root.querySelector("[data-m2-reveal]"), result=root.querySelector("[data-m2-result]");
    function run(show){
      const scale=Number(range.value); value.textContent=scale.toFixed(1);
      const pts=base.map(q=>({x:q[0],y:q[1]*scale}));
      let centers=[{x:-2,y:-.2*scale},{x:2,y:.2*scale}];
      for(let z=0;z<20;z++){
        const groups=[[],[]];
        pts.forEach(p=>{
          const d=centers.map(c=>(p.x-c.x)**2+(p.y-c.y)**2);
          groups[d[0]<=d[1]?0:1].push(p);
        });
        const next=centers.map((c,i)=>groups[i].length?{x:mean(groups[i].map(p=>p.x)),y:mean(groups[i].map(p=>p.y))}:c);
        if(next.every((c,i)=>Math.hypot(c.x-centers[i].x,c.y-centers[i].y)<1e-9)) break;
        centers=next;
      }
      let inertia=0;
      pts.forEach(p=>inertia+=Math.min(...centers.map(c=>(p.x-c.x)**2+(p.y-c.y)**2)));
      const px=v=>28+(v+3)/6*560, py=v=>236-(v+4)/8*212;
      svg.innerHTML=pts.map(p=>{
        const d=centers.map(c=>(p.x-c.x)**2+(p.y-c.y)**2);
        return '<circle cx="'+px(p.x)+'" cy="'+py(p.y)+'" r="5" fill="'+(d[0]<=d[1]?'currentColor':'#9ca3af')+'"/>';
      }).join("")+centers.map(c=>'<path d="M'+(px(c.x)-7)+' '+(py(c.y)-7)+'L'+(px(c.x)+7)+' '+(py(c.y)+7)+'M'+(px(c.x)+7)+' '+(py(c.y)-7)+'L'+(px(c.x)-7)+' '+(py(c.y)+7)+'" stroke="currentColor" stroke-width="3"/>').join("");
      metrics.innerHTML='<div class="m2-metric"><span>Inertia</span><strong>'+inertia.toFixed(3)+'</strong></div>'+
        '<div class="m2-metric"><span>Feature 2 scale</span><strong>'+scale.toFixed(1)+'</strong></div>'+
        '<div class="m2-metric"><span>Clusters</span><strong>2</strong></div>';
      result.textContent=show?"K-means recomputed assignments after feature scaling. Inertia = "+inertia.toFixed(3)+".":"Predict whether feature scaling should change a distance-based clustering result.";
    }
    range.addEventListener("input",()=>run(false)); reveal.addEventListener("click",()=>run(true)); run(false);
  }

  function evaluation(root) {
    const scores=[.78,.82,.74,.88,.81,.76,.85,.79,.83,.77];
    const range=root.querySelector("[data-m2-range]"), value=root.querySelector("[data-m2-value]");
    const plot=root.querySelector("[data-m2-plot]"), metrics=root.querySelector("[data-m2-metrics]");
    const reveal=root.querySelector("[data-m2-reveal]"), result=root.querySelector("[data-m2-result]");
    function run(show){
      const k=Number(range.value); value.textContent=k;
      const s=scores.slice(0,k), avg=mean(s), sd=Math.sqrt(mean(s.map(v=>(v-avg)**2)));
      plot.innerHTML=s.map((v,i)=>'<div class="m2-fold"><span>Fold '+(i+1)+'</span><b style="width:'+(v*100)+'%"></b><strong>'+(v*100).toFixed(1)+'%</strong></div>').join("");
      metrics.innerHTML='<div class="m2-metric"><span>Mean score</span><strong>'+(avg*100).toFixed(1)+'%</strong></div>'+
        '<div class="m2-metric"><span>Std. dev.</span><strong>'+sd.toFixed(3)+'</strong></div>'+
        '<div class="m2-metric"><span>Fits</span><strong>'+k+'</strong></div>';
      result.textContent=show?"These are fixed fold measurements, not a universal score. More folds change the estimator and compute cost.":"Predict what changes when folds increase: estimate variability, compute, or both.";
    }
    range.addEventListener("input",()=>run(false)); reveal.addEventListener("click",()=>run(true)); run(false);
  }

  function engineering(root) {
    const x=[-3,-2.5,-2,-1.5,-1,-.5,0,.5,1,1.5,2,2.5,3];
    const y=x.map(v=>v*v+Math.sin(v)*.7);
    const range=root.querySelector("[data-m2-range]"), value=root.querySelector("[data-m2-value]");
    const svg=root.querySelector("[data-m2-plot]"), metrics=root.querySelector("[data-m2-metrics]");
    const reveal=root.querySelector("[data-m2-reveal]"), result=root.querySelector("[data-m2-result]");
    function run(show){
      const complexity=Number(range.value); value.textContent=complexity;
      const degree=Math.min(6,complexity);
      const pred=v=>v*v*.72+Math.sin(v)*.55+Math.pow(v,Math.max(1,degree))*.02;
      const tr=x.slice(0,8), te=x.slice(8), trainM=mse(y.slice(0,8),tr.map(pred)), testM=mse(y.slice(8),te.map(pred));
      const px=v=>28+(v+3)/6*560, py=v=>236-(v/10)*212;
      svg.innerHTML=x.map((v,i)=>'<circle cx="'+px(v)+'" cy="'+py(y[i])+'" r="5" fill="'+(i<8?'currentColor':'#9ca3af')+'"/>').join("")+
        '<path d="'+x.map((v,i)=>(i?"L":"M")+px(v)+" "+py(pred(v))).join(" ")+'" fill="none" stroke="currentColor" stroke-width="3"/>';
      metrics.innerHTML='<div class="m2-metric"><span>Train MSE</span><strong>'+trainM.toFixed(3)+'</strong></div>'+
        '<div class="m2-metric"><span>Holdout MSE</span><strong>'+testM.toFixed(3)+'</strong></div>'+
        '<div class="m2-metric"><span>Complexity</span><strong>'+complexity+'</strong></div>';
      result.textContent=show?"Measured baseline comparison: holdout MSE = "+testM.toFixed(3)+".":"Predict whether more complexity should improve unseen-data error.";
    }
    range.addEventListener("input",()=>run(false)); reveal.addEventListener("click",()=>run(true)); run(false);
  }

  const cfg={
    "Regression & Classification":["Regression Lab","Adjust regularization and inspect the fitted model.","Regularization λ",0,10,.1,1],
    "Trees & Ensembles":["Tree Split Lab","Choose a split threshold and calculate impurity reduction.","Split threshold",-2.7,2.8,.1,.5],
    "Unsupervised Learning":["Clustering Lab","Change feature scale and observe the geometry k-means sees.","Feature 2 scale",.2,5,.1,1],
    "Evaluation & Validation":["Cross-Validation Lab","Change fold count and inspect the measured fold results.","CV folds",2,10,1,5],
    "ML Engineering Patterns":["Baseline vs Complexity Lab","Change complexity and compare training with holdout error.","Model complexity",1,10,1,3]
  };

  function render(lesson) {
    const c=cfg[lesson.unit];
    if(!c) return "";
    const id="m2real-"+lesson.id.replace(/[^a-zA-Z0-9_-]/g,"");
    const visual=lesson.unit==="Evaluation & Validation"?
      '<div data-m2-plot class="m2-folds"></div>':
      '<svg data-m2-plot viewBox="0 0 620 280" role="img" aria-label="'+esc(c[0])+' visualization"></svg>';
    const prediction=lesson.unit==="Regression & Classification"?
      '<div class="m2-predict"><label>Prediction at x <input data-m2-prediction type="number" value="2" step=".1"></label><label>Your predicted y <input data-m2-answer type="number" value="4" step=".1"></label></div>':
      '';
    return '<section class="m2-real-lab" data-m2-real data-unit="'+esc(lesson.unit)+'"><div class="m2-lab-top"><div><div class="module-num">LIVE LEARNING LAB</div><h3>'+esc(c[0])+'</h3><p>'+esc(c[1])+'</p></div><span class="interactive-state">Prediction first</span></div><div class="m2-lab-control"><label for="'+id+'">'+esc(c[2])+' <strong data-m2-value>'+c[6]+'</strong></label><input id="'+id+'" data-m2-range type="range" min="'+c[3]+'" max="'+c[4]+'" step="'+c[5]+'" value="'+c[6]+'"></div><div class="m2-visual">'+visual+'</div><div class="m2-metrics" data-m2-metrics></div>'+prediction+'<div class="interactive-actions"><button class="action secondary" type="button" data-m2-reveal>Reveal measured behavior</button></div><p class="interactive-note" data-m2-result>Predict first. The platform will calculate the result from the fixed dataset.</p></section>';
  }

  function bind() {
    document.querySelectorAll("[data-m2-real]").forEach(root=>{
      const unit=root.dataset.unit;
      if(unit==="Regression & Classification") regression(root);
      else if(unit==="Trees & Ensembles") trees(root);
      else if(unit==="Unsupervised Learning") clustering(root);
      else if(unit==="Evaluation & Validation") evaluation(root);
      else if(unit==="ML Engineering Patterns") engineering(root);
    });
  }

  window.Module02Labs={render,bind};
})();