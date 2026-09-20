
(function(){
  const esc = function(v){ return String(v == null ? "" : v).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); };
  const mean = function(a){ return a.reduce(function(s,x){return s+x;},0)/a.length; };
  const mse = function(a,b){ return mean(a.map(function(x,i){return (x-b[i])*(x-b[i]);})); };
  const gini = function(y){
    if(!y.length) return 0;
    const c={}; y.forEach(function(v){c[v]=(c[v]||0)+1;});
    return 1-Object.keys(c).reduce(function(s,k){return s+Math.pow(c[k]/y.length,2);},0);
  };
  function regression(root){
    const pts=[]; for(let i=0;i<24;i++){const x=-3+i*.26; pts.push({x:x,y:1.8*x+.7+Math.sin(i*1.73+7)*.32});}
    const r=root.querySelector("[data-m2-range]"), val=root.querySelector("[data-m2-value]"), svg=root.querySelector("[data-m2-plot]"), met=root.querySelector("[data-m2-metrics]"), rev=root.querySelector("[data-m2-reveal]"), out=root.querySelector("[data-m2-result]");
    function render(show){
      const l=Number(r.value); val.textContent=l.toFixed(1);
      let sxx=0,sx=0,sy=0,sxy=0; pts.forEach(function(p){sxx+=p.x*p.x;sx+=p.x;sy+=p.y;sxy+=p.x*p.y;});
      const n=pts.length, a=sxx+l,b=sx,c=sx,d=n+l*.01,det=a*d-b*c,w=(sxy*d-b*sy)/det,inter=(a*sy-c*sxy)/det;
      const tr=pts.slice(0,18),te=pts.slice(18), tp=tr.map(function(p){return w*p.x+inter;}),ep=te.map(function(p){return w*p.x+inter;});
      const W=620,H=280,x0=-3.2,x1=3.2,y0=-6,y1=7,sxv=function(x){return 28+(x-x0)/(x1-x0)*560;},syv=function(y){return H-24-(y-y0)/(y1-y0)*232;};
      let html=pts.map(function(p){return '<circle cx="'+sxv(p.x).toFixed(1)+'" cy="'+syv(p.y).toFixed(1)+'" r="4" fill="currentColor"/>';}).join("");
      html+='<line x1="'+sxv(x0)+'" y1="'+syv(w*x0+inter)+'" x2="'+sxv(x1)+'" y2="'+syv(w*x1+inter)+'" stroke="currentColor" stroke-width="3"/>';
      svg.innerHTML=html;
      met.innerHTML='<div class="m2-metric"><span>Train MSE</span><strong>'+mse(tr.map(function(p){return p.y;}),tp).toFixed(3)+'</strong></div><div class="m2-metric"><span>Holdout MSE</span><strong>'+mse(te.map(function(p){return p.y;}),ep).toFixed(3)+'</strong></div><div class="m2-metric"><span>Slope</span><strong>'+w.toFixed(3)+'</strong></div>';
      out.textContent=show?"Measured from the fixed dataset. Holdout error is evaluated on observations not used for fitting.":"Predict first. Then reveal the fitted model and measured holdout behavior.";
    }
    r.addEventListener("input",function(){render(false);}); rev.addEventListener("click",function(){render(true);}); render(false);
  }
  function trees(root){
    const x=[-2.7,-2.1,-1.6,-1.1,-.7,-.3,.2,.6,1,1.4,1.8,2.3,2.8], y=[0,0,0,0,0,1,1,0,1,1,1,1,1];
    const r=root.querySelector("[data-m2-range]"),val=root.querySelector("[data-m2-value]"),svg=root.querySelector("[data-m2-plot]"),met=root.querySelector("[data-m2-metrics]"),rev=root.querySelector("[data-m2-reveal]"),out=root.querySelector("[data-m2-result]");
    function render(show){
      const t=Number(r.value);val.textContent=t.toFixed(1);
      const L=y.filter(function(_,i){return x[i]<=t;}),R=y.filter(function(_,i){return x[i]>t;}),wg=(L.length*gini(L)+R.length*gini(R))/y.length,g=gini(y)-wg,sx=function(v){return 35+(v+3)/6*550;};
      svg.innerHTML='<line x1="35" y1="185" x2="585" y2="185" stroke="currentColor" opacity=".25"/>'+x.map(function(v,i){return '<circle cx="'+sx(v)+'" cy="'+(y[i]?80:150)+'" r="6" fill="'+(v<=t?'currentColor':'none')+'" stroke="currentColor"/>';}).join("")+'<line x1="'+sx(t)+'" y1="30" x2="'+sx(t)+'" y2="190" stroke="currentColor" stroke-width="3" stroke-dasharray="6 5"/>';
      met.innerHTML='<div class="m2-metric"><span>Parent Gini</span><strong>'+gini(y).toFixed(3)+'</strong></div><div class="m2-metric"><span>Weighted child Gini</span><strong>'+wg.toFixed(3)+'</strong></div><div class="m2-metric"><span>Information gain</span><strong>'+g.toFixed(3)+'</strong></div>';
      out.textContent=show?"Measured gain is "+g.toFixed(3)+" at threshold "+t.toFixed(1)+".":"Choose a threshold and predict which split reduces impurity most.";
    }
    r.addEventListener("input",function(){render(false);});rev.addEventListener("click",function(){render(true);});render(false);
  }
  function clustering(root){
    const base=[[-2.4,-.8],[-2,-.4],[-1.8,.1],[-2.3,.5],[-1.3,-.2],[-1.6,.7],[1.5,-.7],[1.9,-.2],[2.4,.1],[1.7,.5],[2.2,.8],[2.7,.2]];
    const r=root.querySelector("[data-m2-range]"),val=root.querySelector("[data-m2-value]"),svg=root.querySelector("[data-m2-plot]"),met=root.querySelector("[data-m2-metrics]"),rev=root.querySelector("[data-m2-reveal]"),out=root.querySelector("[data-m2-result]");
    function render(show){
      const scale=Number(r.value);val.textContent=scale.toFixed(1);const p=base.map(function(q){return{x:q[0],y:q[1]*scale};});let c=[{x:-2,y:-.2*scale},{x:2,y:.2*scale}];
      for(let z=0;z<12;z++){const g=[[],[]];p.forEach(function(q){const d=c.map(function(k){return(q.x-k.x)*(q.x-k.x)+(q.y-k.y)*(q.y-k.y);});g[d[0]<=d[1]?0:1].push(q);});c=g.map(function(a,i){return a.length?{x:mean(a.map(function(q){return q.x;})),y:mean(a.map(function(q){return q.y;}))}:c[i];});}
      let inertia=0;p.forEach(function(q){inertia+=Math.min.apply(null,c.map(function(k){return(q.x-k.x)*(q.x-k.x)+(q.y-k.y)*(q.y-k.y);}));});
      const sx=function(v){return 28+(v+3)/6*560;},sy=function(v){return 236-(v+4)/8*212;};
      svg.innerHTML=p.map(function(q){const d=c.map(function(k){return(q.x-k.x)*(q.x-k.x)+(q.y-k.y)*(q.y-k.y);});return '<circle cx="'+sx(q.x)+'" cy="'+sy(q.y)+'" r="5" fill="'+(d[0]<=d[1]?'currentColor':'#9ca3af')+'"/>';}).join("")+c.map(function(k){return '<path d="M'+(sx(k.x)-7)+' '+(sy(k.y)-7)+'L'+(sx(k.x)+7)+' '+(sy(k.y)+7)+'M'+(sx(k.x)+7)+' '+(sy(k.y)-7)+'L'+(sx(k.x)-7)+' '+(sy(k.y)+7)+'" stroke="currentColor" stroke-width="3"/>';}).join("");
      met.innerHTML='<div class="m2-metric"><span>Inertia</span><strong>'+inertia.toFixed(3)+'</strong></div><div class="m2-metric"><span>Feature 2 scale</span><strong>'+scale.toFixed(1)+'</strong></div><div class="m2-metric"><span>Clusters</span><strong>2</strong></div>';
      out.textContent=show?"K-means recomputed assignments after the representation changed. Inertia = "+inertia.toFixed(3)+".":"Predict whether feature scaling should change a distance-based clustering result.";
    }
    r.addEventListener("input",function(){render(false);});rev.addEventListener("click",function(){render(true);});render(false);
  }
  function evaluation(root){
    const scores=[.78,.82,.74,.88,.81,.76,.85,.79,.83,.77],r=root.querySelector("[data-m2-range]"),val=root.querySelector("[data-m2-value]"),svg=root.querySelector("[data-m2-plot]"),met=root.querySelector("[data-m2-metrics]"),rev=root.querySelector("[data-m2-reveal]"),out=root.querySelector("[data-m2-result]");
    function render(show){const k=Number(r.value);val.textContent=k;const s=scores.slice(0,k),avg=mean(s),sd=Math.sqrt(mean(s.map(function(v){return(v-avg)*(v-avg);})));svg.outerHTML='<div class="m2-folds" data-m2-plot>'+s.map(function(v,i){return '<div class="m2-fold"><span>Fold '+(i+1)+'</span><b style="width:'+(v*100)+'%"></b><strong>'+(v*100).toFixed(1)+'%</strong></div>';}).join("")+'</div>';met.innerHTML='<div class="m2-metric"><span>Mean score</span><strong>'+(avg*100).toFixed(1)+'%</strong></div><div class="m2-metric"><span>Std. dev.</span><strong>'+sd.toFixed(3)+'</strong></div><div class="m2-metric"><span>Fits</span><strong>'+k+'</strong></div>';out.textContent=show?"The fold measurements are now explicit. More folds mean more fitted models and a different estimator variance profile.":"Predict what changes when folds increase: estimate stability, compute, or both."; }
    r.addEventListener("input",function(){render(false);});rev.addEventListener("click",function(){render(true);});render(false);
  }
  function engineering(root){
    const x=[-3,-2.5,-2,-1.5,-1,-.5,0,.5,1,1.5,2,2.5,3],y=x.map(function(v){return v*v+Math.sin(v)*.7;}),r=root.querySelector("[data-m2-range]"),val=root.querySelector("[data-m2-value]"),svg=root.querySelector("[data-m2-plot]"),met=root.querySelector("[data-m2-metrics]"),rev=root.querySelector("[data-m2-reveal]"),out=root.querySelector("[data-m2-result]");
    function render(show){const c=Number(r.value);val.textContent=c;const d=Math.min(6,c),pred=function(v){return v*v*.72+Math.sin(v)*.55+Math.pow(v,Math.max(1,d))*.02;},tr=x.slice(0,8),te=x.slice(8),tm=mse(y.slice(0,8),pred(tr)),em=mse(y.slice(8),pred(te)),sx=function(v){return 28+(v+3)/6*560;},sy=function(v){return 236-(v/10)*212;};svg.innerHTML=x.map(function(v,i){return '<circle cx="'+sx(v)+'" cy="'+sy(y[i])+'" r="5" fill="'+(i<8?'currentColor':'#9ca3af')+'"/>';}).join("")+'<path d="'+x.map(function(v,i){return(i?'L':'M')+sx(v)+' '+sy(pred(v));}).join(" ")+'" fill="none" stroke="currentColor" stroke-width="3"/>';met.innerHTML='<div class="m2-metric"><span>Train MSE</span><strong>'+tm.toFixed(3)+'</strong></div><div class="m2-metric"><span>Holdout MSE</span><strong>'+em.toFixed(3)+'</strong></div><div class="m2-metric"><span>Complexity</span><strong>'+c+'</strong></div>';out.textContent=show?"Measured baseline comparison: holdout MSE = "+em.toFixed(3)+". Complexity is only useful if unseen-data behavior improves under the same protocol.":"Predict whether more complexity should improve unseen-data error."; }
    r.addEventListener("input",function(){render(false);});rev.addEventListener("click",function(){render(true);});render(false);
  }
  const cfg={
    "Regression & Classification":["Regression Lab","Adjust regularization and inspect the fitted model.","Regularization λ",0,10,.1,1],
    "Trees & Ensembles":["Tree Split Lab","Choose a split threshold and calculate impurity reduction.","Split threshold",-2.7,2.8,.1,.5],
    "Unsupervised Learning":["Clustering Lab","Change feature scale and observe the geometry k-means sees.","Feature 2 scale",.2,5,.1,1],
    "Evaluation & Validation":["Cross-Validation Lab","Change fold count and inspect the measured fold results.","CV folds",2,10,1,5],
    "ML Engineering Patterns":["Baseline vs Complexity Lab","Change complexity and compare training with holdout error.","Model complexity",1,10,1,3]
  };
  function render(lesson){
    const c=cfg[lesson.unit];if(!c)return "";
    const id="m2real-"+lesson.id.replace(/[^a-zA-Z0-9_-]/g,"");
    const svg=lesson.unit==="Evaluation & Validation"?"<div data-m2-plot class=\"m2-folds\"></div>":"<svg data-m2-plot viewBox=\"0 0 620 280\" role=\"img\" aria-label=\""+esc(c[0])+" visualization\"></svg>";
    return "<section class=\"m2-real-lab\" data-m2-real data-unit=\""+esc(lesson.unit)+"\"><div class=\"m2-lab-top\"><div><div class=\"module-num\">LIVE LEARNING LAB</div><h3>"+esc(c[0])+"</h3><p>"+esc(c[1])+"</p></div><span class=\"interactive-state\">Prediction first</span></div><div class=\"m2-lab-control\"><label for=\""+id+"\">"+esc(c[2])+" <strong data-m2-value>"+c[6]+"</strong></label><input id=\""+id+"\" data-m2-range type=\"range\" min=\""+c[3]+"\" max=\""+c[4]+"\" step=\""+c[5]+"\" value=\""+c[6]+"\"></div><div class=\"m2-visual\">"+svg+"</div><div class=\"m2-metrics\" data-m2-metrics></div><div class=\"interactive-actions\"><button class=\"action secondary\" type=\"button\" data-m2-reveal>Reveal measured behavior</button></div><p class=\"interactive-note\" data-m2-result>Predict first. The platform will calculate the result from the fixed dataset.</p></section>";
  }
  function bind(){
    document.querySelectorAll("[data-m2-real]").forEach(function(root){const u=root.dataset.unit;if(u==="Regression & Classification")regression(root);else if(u==="Trees & Ensembles")trees(root);else if(u==="Unsupervised Learning")clustering(root);else if(u==="Evaluation & Validation")evaluation(root);else if(u==="ML Engineering Patterns")engineering(root);});
  }
  window.Module02Labs={render:render,bind:bind};
})();
