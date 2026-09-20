(() => {
  const LABS = {
    "Neural Network Foundations": {
      title: "Gradient Flow Lab",
      intro: "Trace how a scalar loss changes a tiny two-layer network. Adjust the hidden activation scale and observe the resulting gradient magnitude.",
      render() {
        return '<div class="m3-real-lab"><div class="m3-lab-top"><div><span class="module-num">INTERACTIVE LAB</span><h3>Gradient Flow</h3><p>Change the activation scale and predict whether gradients will shrink or grow.</p></div><label class="m3-lab-control">Activation scale <input id="m3-grad-scale" type="range" min="0.2" max="3" step="0.1" value="1"><output id="m3-grad-scale-out">1.0×</output></label></div><div class="m3-visual" id="m3-grad-visual"></div><div class="m3-metrics" id="m3-grad-metrics"></div><div class="m3-lab-note">Prediction: very small scales can suppress downstream signal; large scales can increase activation and gradient magnitude. The exact effect depends on the activation and loss.</div></div>';
      },
      bind() {
        const input=document.querySelector("#m3-grad-scale"); if(!input) return;
        const update=()=>{const s=Number(input.value); const grad=2*s*Math.tanh(s); const act=Math.tanh(s); document.querySelector("#m3-grad-scale-out").textContent=s.toFixed(1)+"×"; document.querySelector("#m3-grad-visual").innerHTML='<div class="m3-flow"><span>x</span><b>× '+s.toFixed(1)+'</b><span>tanh</span><b>'+act.toFixed(3)+'</b><span>loss</span></div>'; document.querySelector("#m3-grad-metrics").innerHTML='<div class="m3-metric"><span>Activation</span><strong>'+act.toFixed(3)+'</strong></div><div class="m3-metric"><span>Proxy gradient</span><strong>'+grad.toFixed(3)+'</strong></div><div class="m3-metric"><span>Scale</span><strong>'+s.toFixed(1)+'×</strong></div>';};
        input.addEventListener("input",update); update();
      }
    },
    "Convolutional Learning": {
      title: "Receptive Field Lab",
      render() {
        return '<div class="m3-real-lab"><div class="m3-lab-top"><div><span class="module-num">INTERACTIVE LAB</span><h3>Receptive Field</h3><p>Change kernel size and depth. The highlighted region represents the theoretical receptive-field span for stacked stride-1 convolutions.</p></div><label class="m3-lab-control">Kernel <input id="m3-kernel" type="range" min="1" max="7" step="2" value="3"><output id="m3-kernel-out">3×3</output></label><label class="m3-lab-control">Layers <input id="m3-depth" type="range" min="1" max="5" value="2"><output id="m3-depth-out">2</output></label></div><div class="m3-visual" id="m3-rf-visual"></div><div class="m3-metrics" id="m3-rf-metrics"></div></div>';
      },
      bind() {
        const k=document.querySelector("#m3-kernel"), d=document.querySelector("#m3-depth"); if(!k||!d) return;
        const update=()=>{const K=+k.value,D=+d.value,rf=1+D*(K-1); k.nextElementSibling.textContent=K+"×"+K; d.nextElementSibling.textContent=D; document.querySelector("#m3-rf-visual").innerHTML='<div class="m3-grid">'+Array.from({length:49},(_,i)=>'<span class="'+(Math.abs(i%7-3)<=Math.floor(rf/2)&&Math.abs(Math.floor(i/7)-3)<=Math.floor(rf/2)?"hot":"")+'"></span>').join("")+'</div>'; document.querySelector("#m3-rf-metrics").innerHTML='<div class="m3-metric"><span>Receptive field span</span><strong>'+rf+'×'+rf+'</strong></div><div class="m3-metric"><span>Kernel parameters / channel pair</span><strong>'+K*K+'</strong></div><div class="m3-metric"><span>Stride</span><strong>1</strong></div>';};
        k.addEventListener("input",update); d.addEventListener("input",update); update();
      }
    },
    "Sequence Models": {
      title: "Sequence Gradient Lab",
      render() {
        return '<div class="m3-real-lab"><div class="m3-lab-top"><div><span class="module-num">INTERACTIVE LAB</span><h3>Long-Sequence Pressure</h3><p>Use a simple repeated Jacobian factor to see why repeated multiplication can shrink or grow a gradient signal.</p></div><label class="m3-lab-control">Jacobian magnitude <input id="m3-jac" type="range" min="0.7" max="1.3" step="0.01" value="0.9"><output id="m3-jac-out">0.90</output></label><label class="m3-lab-control">Steps <input id="m3-steps" type="range" min="2" max="50" value="20"><output id="m3-steps-out">20</output></label></div><div class="m3-visual" id="m3-seq-visual"></div><div class="m3-metrics" id="m3-seq-metrics"></div></div>';
      },
      bind() {
        const j=document.querySelector("#m3-jac"), t=document.querySelector("#m3-steps"); if(!j||!t) return;
        const update=()=>{const a=+j.value,n=+t.value,g=Math.pow(a,n); j.nextElementSibling.textContent=a.toFixed(2); t.nextElementSibling.textContent=n; const pct=Math.min(100,Math.max(2,Math.abs(g)*100)); document.querySelector("#m3-seq-visual").innerHTML='<div class="m3-bar"><span style="width:'+pct+'%"></span></div>'; document.querySelector("#m3-seq-metrics").innerHTML='<div class="m3-metric"><span>Repeated product</span><strong>'+g.toExponential(3)+'</strong></div><div class="m3-metric"><span>Regime</span><strong>'+(a<1?"shrinking":a>1?"growing":"stable")+'</strong></div><div class="m3-metric"><span>Steps</span><strong>'+n+'</strong></div>';};
        j.addEventListener("input",update); t.addEventListener("input",update); update();
      }
    },
    "Transformer Foundations": {
      title: "Attention Lab",
      render() {
        return '<div class="m3-real-lab"><div class="m3-lab-top"><div><span class="module-num">INTERACTIVE LAB</span><h3>Attention Distribution</h3><p>Move the temperature to make the softmax distribution sharper or flatter. The probabilities always sum to one.</p></div><label class="m3-lab-control">Temperature <input id="m3-temp" type="range" min="0.2" max="2" step="0.05" value="1"><output id="m3-temp-out">1.00</output></label></div><div class="m3-attention" id="m3-attention"></div><div class="m3-metrics" id="m3-attention-metrics"></div></div>';
      },
      bind() {
        const temp=document.querySelector("#m3-temp"); if(!temp) return;
        const scores=[2.4,1.3,0.4,-0.2]; const softmax=a=>{const m=Math.max(...a),e=a.map(v=>Math.exp(v-m));const z=e.reduce((x,y)=>x+y,0);return e.map(v=>v/z);};
        const update=()=>{const T=+temp.value,p=softmax(scores.map(x=>x/T)); temp.nextElementSibling.textContent=T.toFixed(2); document.querySelector("#m3-attention").innerHTML=p.map((v,i)=>'<div class="m3-att-row"><span>token '+(i+1)+'</span><div><i style="width:'+Math.max(2,v*100)+'%"></i></div><strong>'+v.toFixed(3)+'</strong></div>').join(""); const entropy=-p.reduce((s,v)=>s+v*Math.log2(v),0); document.querySelector("#m3-attention-metrics").innerHTML='<div class="m3-metric"><span>Probability sum</span><strong>'+p.reduce((s,v)=>s+v,0).toFixed(3)+'</strong></div><div class="m3-metric"><span>Entropy</span><strong>'+entropy.toFixed(3)+' bits</strong></div><div class="m3-metric"><span>Highest weight</span><strong>token '+(p.indexOf(Math.max(...p))+1)+'</strong></div>';};
        temp.addEventListener("input",update); update();
      }
    },
    "Training Dynamics": {
      title: "Training Stability Lab",
      render() {
        return '<div class="m3-real-lab"><div class="m3-lab-top"><div><span class="module-num">INTERACTIVE LAB</span><h3>Learning-Rate Stability</h3><p>Explore a deterministic quadratic optimization system. The stable region is visible without training a neural network.</p></div><label class="m3-lab-control">Learning rate <input id="m3-lr" type="range" min="0.01" max="1.2" step="0.01" value="0.2"><output id="m3-lr-out">0.20</output></label><label class="m3-lab-control">Steps <input id="m3-train-steps" type="range" min="5" max="30" value="15"><output id="m3-train-steps-out">15</output></label></div><div class="m3-visual" id="m3-loss-visual"></div><div class="m3-metrics" id="m3-loss-metrics"></div></div>';
      },
      bind() {
        const lr=document.querySelector("#m3-lr"), steps=document.querySelector("#m3-train-steps"); if(!lr||!steps) return;
        const update=()=>{const eta=+lr.value,n=+steps.value;let x=4;const vals=[];for(let i=0;i<n;i++){vals.push(x*x);x=x-eta*2*x;}const max=Math.max(...vals,1);lr.nextElementSibling.textContent=eta.toFixed(2);steps.nextElementSibling.textContent=n;document.querySelector("#m3-loss-visual").innerHTML='<div class="m3-spark">'+vals.map(v=>'<span style="height:'+Math.min(100,Math.max(3,v/max*100))+'%"></span>').join("")+'</div>';document.querySelector("#m3-loss-metrics").innerHTML='<div class="m3-metric"><span>Initial loss</span><strong>'+vals[0].toFixed(3)+'</strong></div><div class="m3-metric"><span>Final loss</span><strong>'+vals.at(-1).toFixed(3)+'</strong></div><div class="m3-metric"><span>Regime</span><strong>'+(eta<0.5?"stable / convergent":eta<1?"oscillatory / boundary":"unstable")+'</strong></div>';};
        lr.addEventListener("input",update); steps.addEventListener("input",update); update();
      }
    }
  };

  function render(lesson){
    const lab=LABS[lesson.unit];
    if(!lab) return "";
    return '<section class="m3-lab-slot" data-m3-lab="'+lesson.unit.replace(/[^a-z0-9]+/gi,"-")+'">'+lab.render()+'</section>';
  }
  function bind(){ for(const lab of Object.values(LABS)){ lab.bind(); } }
  window.Module03Labs={render,bind};
})();