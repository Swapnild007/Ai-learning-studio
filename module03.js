/* Research-backed Module 03 curriculum layer.
   Sources: MIT 6.7960 Deep Learning, MIT 6.390 IntroML, PyTorch documentation,
   and Vaswani et al., Attention Is All You Need.
*/
(() => {
  const m = CURRICULUM.modules.find(x => x.id === "m3");
  if (!m || typeof LESSONS === "undefined") return;

  m.desc = "Deep learning from neural-network mechanics through convolution, sequence modeling, transformers and reliable training.";
  m.tags = ["Deep Learning","PyTorch","Backpropagation","Transformers"];
  m.researchBasis = [
    {institution:"MIT",course:"6.7960 Deep Learning",focus:"neural networks, backpropagation, CNNs, RNNs, transformers, representation learning, optimization and generalization",url:"https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/"},
    {institution:"MIT",course:"6.390 Introduction to Machine Learning",focus:"transformers, attention and modern machine-learning foundations",url:"https://introml.mit.edu/notes/"},
    {institution:"PyTorch",course:"PyTorch Tutorials",focus:"tensors, autograd, model construction and training workflows",url:"https://docs.pytorch.org/tutorials/beginner/intro"},
    {institution:"Vaswani et al.",course:"Attention Is All You Need",focus:"self-attention and Transformer architecture",url:"https://arxiv.org/abs/1706.03762"}
  ];
  m.masteryGate = {
    title:"Module 03 Mastery Gate",
    criteria:[
      "Derive backpropagation for a small multilayer network and verify gradients numerically.",
      "Implement and train a small neural network in PyTorch while explaining tensors, autograd, loss and optimizer state.",
      "Explain convolution as a local parameter-sharing operation and diagnose shape/receptive-field behavior.",
      "Trace an RNN failure mode and explain why attention changes sequence computation.",
      "Implement scaled dot-product attention and explain residual connections, normalization and positional information.",
      "Run a controlled training experiment and diagnose instability using loss, gradient and resource evidence."
    ],
    capabilities:["Neural-network mathematics","Automatic differentiation","PyTorch implementation","Architecture reasoning","Training diagnostics","Experimental design"],
    deliverable:"Complete the required derivations, implementations, architecture labs, controlled training experiments and technical reflection. The platform can use the resulting work to determine mastery."
  };

  const stages=["Foundation","Derivation","Implementation","Engineering","Experiment","Research"];
  const stageInfo={
    Foundation:{type:"concept",title:"Core Model & Intuition",body:"Build the computational mental model: tensors, parameters, forward computation, loss, gradients and architectural structure."},
    Derivation:{type:"derivation",title:"First-Principles Derivation",body:"Derive the central operation from scalar definitions and the chain rule, keeping tensor shapes and assumptions explicit."},
    Implementation:{type:"coding-task",title:"From Mathematics to PyTorch",body:"Implement the smallest correct version, inspect intermediate tensors and compare critical results with an independent reference."},
    Engineering:{type:"debug-task",title:"Training & Root Cause",body:"Reproduce a training or architecture failure, instrument the relevant invariant, isolate the cause and add a regression check."},
    Experiment:{type:"experiment",title:"Controlled Training Study",body:"Define a baseline, change one training or architecture variable, repeat the measurement and separate observation from interpretation."},
    Research:{type:"research-task",title:"Falsifiable Deep-Learning Study",body:"Frame a narrow architectural or optimization question, predefine the comparison and report uncertainty, limitations and negative results."}
  };

  const P={
    "Neural Network Foundations":{
      focus:"MLPs, activations, loss functions, backpropagation, initialization and automatic differentiation",
      why:"Neural networks are compositions of parameterized functions. Understanding the forward graph, loss and reverse-mode derivatives makes training behavior inspectable instead of magical.",
      vocab:["Parameter = learned tensor.","Activation = nonlinear transformation applied to an intermediate representation.","Logit = pre-probability score produced by a classifier.","Loss = scalar objective used for training.","Backpropagation = reverse application of the chain rule through a computation graph.","Gradient = derivative of the loss with respect to a parameter.","Initialization = rule used to choose starting parameters.","Autograd = automatic differentiation over the recorded computation graph."],
      mental:["A neural network is a composition of functions, not a black box.","The forward pass produces a prediction and intermediate activations; the backward pass propagates derivatives.","Nonlinearity allows layered composition to represent functions that a single linear map cannot.","Initialization and normalization affect signal and gradient propagation.","Autograd computes derivatives; the optimizer decides how parameters are updated."],
      examples:["For y=wx+b followed by a scalar loss, the gradient with respect to w is the upstream loss derivative multiplied by x.","A two-layer MLP alternates affine transformations and nonlinearities; removing every nonlinearity collapses the stack into one affine transformation."],
      math:"Derive the chain rule for a two-layer scalar network, vectorize it for matrices, and connect dL/dW to parameter updates.",
      implementation:"Implement a tiny MLP with explicit forward equations, then reproduce the same computation using PyTorch modules and autograd.",
      experiment:"Measure the effect of activation choice and initialization on convergence, gradient norms and final validation loss.",
      failure:"Wrong tensor shapes, detached graphs, saturated activations, exploding/vanishing gradients and optimizer-state confusion.",
      lab:"Build a two-layer classifier, inspect activations and gradients, and compare analytical, finite-difference and autograd gradients.",
      misconceptions:["Backpropagation is not the optimizer.","More layers do not automatically mean better representations.","A lower training loss does not by itself establish generalization.","Autograd does not make an incorrect computation graph correct."],
      steps:{
        Foundation:["Trace tensors through a forward pass.","Explain parameters, activations and loss.","Separate backpropagation from optimization."],
        Derivation:["Derive the chain rule for a two-layer network.","Derive matrix gradients and identify transposes.","Explain why nonlinear activations are necessary for expressive depth."],
        Implementation:["Build a tiny MLP with PyTorch tensors.","Verify gradients with finite differences.","Compare manual forward computation with nn.Module output."],
        Engineering:["Diagnose a detached or exploding gradient.","Inspect gradient norms and activation ranges.","Add assertions for tensor shapes and finite values."],
        Experiment:["Compare two activations under the same initialization protocol.","Measure convergence, gradient norms and validation loss.","Repeat across seeds and preserve failed runs."],
        Research:["Test whether an initialization rule changes early gradient stability.","Predefine the metric and falsification condition.","Report where the observed effect is absent or seed-sensitive."]
      }
    },
    "Convolutional Learning":{
      focus:"convolution, receptive fields, stride, padding, parameter sharing, normalization and visual representations",
      why:"Convolution builds an inductive bias for local structure and parameter sharing. Understanding the geometry explains both its efficiency and its limitations.",
      vocab:["Kernel = learned local filter.","Stride = spatial step between kernel applications.","Padding = added border values used to control spatial extent.","Receptive field = input region influencing a unit.","Channel = feature dimension in a tensor.","Parameter sharing = reusing the same kernel weights across locations.","Feature map = spatial output produced by a convolution.","Normalization = transformation intended to control activation statistics."],
      mental:["A convolution reuses the same learned weights at many spatial locations.","Kernel size, stride and padding determine output geometry.","Depth increases effective receptive field and representation hierarchy.","Normalization changes activation distributions and optimization behavior; it is not a substitute for understanding the data path.","Pooling and striding trade spatial resolution for computation and receptive field."],
      examples:["A 3x3 kernel with stride 1 scans neighboring pixels while sharing the same nine spatial weights across positions.","Two 3x3 layers can create a larger effective receptive field than one 3x3 layer while inserting an additional nonlinear transformation."],
      math:"Derive 2D convolution output size and local weighted-sum computation. Track batch, channel, height and width dimensions explicitly.",
      implementation:"Implement a small 2D convolution on a toy image, then compare with torch.nn.Conv2d and inspect receptive-field behavior.",
      experiment:"Vary kernel size, stride and depth while measuring output resolution, parameter count and validation behavior.",
      failure:"Incorrect padding assumptions, channel-order errors, shape mismatches, aliasing from aggressive stride and misleading feature visualizations.",
      lab:"Create a synthetic image with a known local pattern and use convolution kernels to detect it while tracking tensor shapes.",
      misconceptions:["Convolution in modern CNN libraries is usually cross-correlation in implementation.","A larger kernel is not automatically a better feature detector.","Feature maps are not direct human-interpretable concepts by default."],
      steps:{
        Foundation:["Trace a kernel across a small image.","Predict output shape from kernel, stride and padding.","Explain parameter sharing."],
        Derivation:["Derive the output-size formula.","Write one convolution output as an explicit weighted sum.","Compute parameter count from channels and kernel size."],
        Implementation:["Implement a toy convolution from nested loops.","Compare against torch.nn.Conv2d.","Add shape and numerical-tolerance tests."],
        Engineering:["Diagnose channel-order and padding bugs.","Inspect receptive-field growth across layers.","Detect invalid normalization placement or shape assumptions."],
        Experiment:["Compare kernel/stride configurations.","Measure parameter count, output resolution and accuracy.","Hold training protocol constant across variants."],
        Research:["Test whether added depth improves a controlled local-pattern task at fixed parameter budget.","Predefine the budget and metric.","Report optimization failures separately from architectural effects."]
      }
    },
    "Sequence Models":{
      focus:"RNNs, LSTMs, hidden state, long-range dependencies and the transition from recurrence to attention",
      why:"Sequence models expose the trade-off between stateful recurrence and parallel computation. Understanding their failure modes explains why attention became central to modern sequence modeling.",
      vocab:["Sequence = ordered collection of inputs.","Hidden state = recurrent representation carried across steps.","Recurrence = applying the same transition repeatedly across a sequence.","Vanishing gradient = gradient magnitude shrinking through repeated transformations.","Exploding gradient = gradient magnitude growing through repeated transformations.","LSTM = gated recurrent architecture designed to improve long-range gradient flow.","Teacher forcing = training a sequence model using reference previous outputs."],
      mental:["RNNs process a sequence step by step and reuse parameters across time.","The hidden state is a compressed summary, so information can be overwritten or forgotten.","Backpropagation through time creates long chains of derivative products.","Gating can improve information flow but does not remove the sequential nature of recurrence.","Attention creates direct interactions between positions and enables parallel processing of a sequence during training."],
      examples:["An RNN updates h_t=f(h_{t-1},x_t), so the current representation depends on all prior state transitions.","A long sequence can make gradients repeatedly multiply by Jacobians, producing vanishing or exploding behavior."],
      math:"Derive a simple recurrent update and backpropagation-through-time dependency. Explain how gating changes the state update.",
      implementation:"Implement a tiny RNN loop, inspect hidden states and gradients, then compare with torch.nn.RNN or LSTM.",
      experiment:"Vary sequence length and initialization while measuring gradient norms and learning performance.",
      failure:"Hidden-state leakage across batches, exploding gradients, vanishing gradients, incorrect sequence dimensions and teacher-forcing mismatch.",
      lab:"Train a toy sequence model to copy or classify short sequences, then deliberately extend sequence length until a failure mode becomes measurable.",
      misconceptions:["LSTM does not make sequence processing parallel across time.","A hidden state is not a perfect memory.","Teacher forcing changes the training dynamics of autoregressive models."],
      steps:{
        Foundation:["Trace hidden-state updates through three time steps.","Explain parameter sharing across time.","Identify where long-range dependency enters."],
        Derivation:["Unroll the recurrence symbolically.","Explain backpropagation through time.","Show why repeated Jacobians affect gradient magnitude."],
        Implementation:["Implement a recurrent loop with explicit hidden state.","Compare with torch.nn.RNN.","Add gradient clipping and verify its effect."],
        Engineering:["Diagnose hidden-state carryover between batches.","Measure exploding or vanishing gradients.","Separate sequence-shape bugs from optimization failures."],
        Experiment:["Sweep sequence length under a fixed protocol.","Compare vanilla RNN and LSTM on the same task.","Report gradient statistics and task performance."],
        Research:["Test whether gating improves long-range dependency retention on a controlled synthetic task.","Predefine sequence lengths and primary metric.","Report where the advantage disappears."]
      }
    },
    "Transformer Foundations":{
      focus:"self-attention, positional information, residual connections, normalization, feed-forward blocks and scaling",
      why:"Transformers replace recurrent sequence processing with attention-based interactions. The architecture is easier to reason about when every tensor operation and shape is explicit.",
      vocab:["Query = vector describing what a position is looking for.","Key = vector used to match a query.","Value = information aggregated after attention weights are computed.","Attention score = compatibility measure between query and key.","Head = one learned attention subspace.","Residual connection = addition of a block input to its transformed output.","Layer normalization = normalization performed across features within a token representation.","Positional information = signal that distinguishes sequence order."],
      mental:["Self-attention creates data-dependent mixing between positions.","Scaled dot-product attention uses softmax(QK^T/sqrt(d_k))V.","Residual paths provide direct information and gradient routes around sublayers.","Normalization changes optimization geometry and interacts with architecture placement.","Without positional information, plain self-attention does not inherently encode token order."],
      examples:["With Q,K,V matrices, attention weights are computed from pairwise query-key compatibility and then used to mix values.","A residual block y=x+F(x) preserves an identity path while allowing F to learn a correction."],
      math:"Derive scaled dot-product attention from Q,K,V shapes and softmax normalization. Track O(n^2) pairwise interaction growth with sequence length.",
      implementation:"Implement single-head attention from matrix operations, then compare with a reference implementation and inspect attention weights.",
      experiment:"Vary sequence length and head dimension while measuring memory, runtime and task behavior.",
      failure:"Wrong transpose, incorrect mask direction, softmax instability, missing scaling, positional confusion and quadratic memory growth.",
      lab:"Build a toy attention visualizer showing QK^T scores, softmax weights and value aggregation for a short sequence.",
      misconceptions:["Attention weights are not automatically explanations.","Transformers are not only attention; feed-forward blocks, residuals and normalization matter.","Causal masking is different from padding masking."],
      steps:{
        Foundation:["Identify Q, K and V roles.","Trace one token's attention to every other token.","Explain why order information is needed."],
        Derivation:["Derive scaled dot-product attention.","Track every tensor shape.","Explain why scaling uses sqrt(d_k)."],
        Implementation:["Implement single-head attention from matrix operations.","Add a causal mask.","Compare outputs with a trusted reference within tolerance."],
        Engineering:["Diagnose mask orientation and softmax failures.","Measure attention memory growth with sequence length.","Check residual and normalization placement."],
        Experiment:["Sweep sequence length and head dimension.","Measure runtime and memory separately from accuracy.","Preserve the same model and data protocol across variants."],
        Research:["Test whether a chosen positional encoding changes a controlled order-sensitive task.","Predefine sequence lengths and evaluation metric.","Report failure cases and alternative explanations."]
      }
    },
    "Training Dynamics":{
      focus:"optimization, regularization, normalization, mixed precision, instability, generalization and debugging",
      why:"Training is a dynamical system. Loss curves, gradients, activations, optimizer state and numerical precision provide evidence about why a model succeeds or fails.",
      vocab:["Batch = subset of training examples used for one update.","Epoch = one pass through the training dataset.","Optimizer state = auxiliary quantities maintained by an optimizer.","Weight decay = parameter shrinkage used as regularization in many optimizers.","Gradient clipping = limiting gradient magnitude.","Mixed precision = using multiple numerical precisions during computation.","Learning-rate schedule = rule controlling step size over training.","Generalization gap = difference between training and held-out performance."],
      mental:["Optimization dynamics depend on data, initialization, architecture, batch size, learning rate and optimizer state.","A loss curve is evidence, not a diagnosis by itself.","Mixed precision changes numerical behavior and can improve throughput but requires stable scaling and supported operations.","Regularization changes the training objective or effective parameter dynamics; it does not replace evaluation."],
      examples:["If training loss is flat from the first step, inspect learning rate, gradients, data flow and loss construction before changing the architecture.","A model can fit training data while held-out loss rises, indicating a growing generalization gap rather than necessarily an optimization failure."],
      math:"Relate parameter updates to gradient statistics, learning rate, momentum/Adam state and regularization. Define numerical overflow/underflow and loss-scale intuition.",
      implementation:"Build a reusable PyTorch training loop with logging, gradient inspection, checkpointing and deterministic configuration.",
      experiment:"Compare learning rates, batch sizes or regularization under a fixed dataset and evaluation protocol.",
      failure:"NaNs, exploding gradients, dead activations, data-loader bugs, accidental train/eval mode errors and hidden nondeterminism.",
      lab:"Run a training-diagnostics harness that records loss, gradient norm, learning rate, memory and validation metrics.",
      misconceptions:["Training loss alone cannot select a reliable model.","A NaN is a symptom, not a root cause.","Deterministic seeds do not guarantee identical behavior across every hardware/software stack."],
      steps:{
        Foundation:["Read training and validation curves.","Explain the role of batch, epoch and optimizer state.","Separate optimization from generalization."],
        Derivation:["Derive SGD and momentum-style updates.","Explain weight decay versus loss penalties.","Relate gradient scale to update magnitude."],
        Implementation:["Build a complete PyTorch training loop.","Add gradient and activation diagnostics.","Save and restore optimizer state correctly."],
        Engineering:["Diagnose NaNs and exploding gradients.","Check train/eval mode and data-loader behavior.","Create a regression test for a previously observed failure."],
        Experiment:["Sweep one optimization variable at a time.","Measure convergence speed, final validation loss and stability.","Repeat across seeds and report dispersion."],
        Research:["Test a training-stability hypothesis under a controlled protocol.","Define the primary stability metric before running.","Report trade-offs and conditions where the effect disappears."]
      }
    }
  };

  const stageMath={
    "Neural Network Foundations":{
      Foundation:"Represent a network as compositions h1=phi(W1x+b1), h2=phi(W2h1+b2), yhat=g(h2). Track tensor shapes at every edge.",
      Derivation:"Use dL/dW2=(dL/dyhat)(dyhat/dh2)(dh2/dW2) and propagate through W1 with the chain rule. Make matrix dimensions explicit.",
      Implementation:"Map forward tensors to PyTorch operations and compare manual gradients with autograd and finite differences on a tiny model.",
      Engineering:"Treat finite tensors, expected shapes, non-null gradients and stable activation ranges as runtime invariants.",
      Experiment:"Measure convergence, gradient norms and validation loss while changing one initialization or activation variable.",
      Research:"Predefine a stability metric and a falsification condition before comparing initialization strategies."
    },
    "Convolutional Learning":{
      Foundation:"For input HxW, kernel K, stride S and padding P, output size is floor((H+2P-K)/S)+1 per spatial dimension.",
      Derivation:"Write each output location as a sum over input channels and kernel offsets; parameter count is Cout*(Cin*K_h*K_w)+Cout when bias is used.",
      Implementation:"Translate the local weighted sum into tensor operations and compare with Conv2d on deterministic inputs.",
      Engineering:"Track N,C,H,W shapes, padding convention, dtype and memory; verify receptive-field assumptions with synthetic impulses.",
      Experiment:"Hold training data and optimizer fixed while varying kernel size, stride or depth.",
      Research:"Define a fixed parameter budget when comparing architectures so parameter count does not silently become the intervention."
    },
    "Sequence Models":{
      Foundation:"A recurrent state follows h_t=f_theta(h_{t-1},x_t); the same theta is reused across time.",
      Derivation:"Unrolling gives dL/dh_t contributions through later states, creating products of recurrent Jacobians that can shrink or grow rapidly.",
      Implementation:"Map an explicit recurrent loop to torch.nn.RNN/LSTM and compare hidden-state shapes and gradients.",
      Engineering:"Treat sequence boundaries, hidden-state reset/detach, padding and batch dimensions as contracts.",
      Experiment:"Use sequence length as the controlled variable and record gradient norms and task performance.",
      Research:"Define a long-range dependency task before testing whether gating changes retention."
    },
    "Transformer Foundations":{
      Foundation:"Attention(Q,K,V)=softmax(QK^T/sqrt(d_k)+mask)V; pairwise scores scale with sequence length squared.",
      Derivation:"Track Q in R^(nxd_k), K in R^(nxd_k), V in R^(nxd_v), scores in R^(nxn) and output in R^(nxd_v).",
      Implementation:"Implement matmul → scale → mask → softmax → weighted sum, then compare against a trusted reference.",
      Engineering:"Validate mask semantics, finite logits, row-wise probability sums and memory growth.",
      Experiment:"Vary sequence length or head dimension while holding the rest of the protocol fixed.",
      Research:"Test a positional representation on an order-sensitive synthetic task and report both success and failure cases."
    },
    "Training Dynamics":{
      Foundation:"SGD uses theta_{t+1}=theta_t-eta*g_t. Training dynamics depend on gradient statistics, learning rate, batch composition and optimizer state.",
      Derivation:"Derive momentum-style updates and distinguish parameter regularization from adding a penalty to the objective.",
      Implementation:"Expose loss, gradient norm, learning rate and optimizer state in a reproducible training loop.",
      Engineering:"Treat NaNs, non-finite gradients, unexpected mode changes and data corruption as diagnostic signals.",
      Experiment:"Change one optimization variable, repeat across seeds and measure convergence plus validation behavior.",
      Research:"Predefine stability, efficiency and quality metrics before comparing training protocols."
    }
  };

  const stageCode={
    "Neural Network Foundations":{
      Foundation:"import torch\nx=torch.tensor([[1.,2.],[2.,-1.]])\nW=torch.tensor([[0.5,-0.2],[0.1,0.7]])\nb=torch.zeros(2)\nh=torch.relu(x@W+b)\nprint(h, h.shape)",
      Derivation:"import torch\nx=torch.tensor([2.0]); w=torch.tensor([3.0],requires_grad=True); b=torch.tensor([1.0],requires_grad=True)\ny=w*x+b; loss=(y-5)**2\nloss.backward()\nprint('y',y.item(),'dw',w.grad.item(),'db',b.grad.item())",
      Implementation:"import torch\nfrom torch import nn\nmodel=nn.Sequential(nn.Linear(2,4),nn.Tanh(),nn.Linear(4,1))\nx=torch.tensor([[1.,2.],[2.,-1.]])\ny=model(x); print('shape',y.shape)",
      Engineering:"import torch\nfrom torch import nn\nmodel=nn.Linear(4,2)\nx=torch.randn(8,4)\ny=model(x)\nassert y.shape==(8,2) and torch.isfinite(y).all()\nprint('contract ok')",
      Experiment:"import torch\nfrom torch import nn\nfor act in [nn.ReLU(),nn.Tanh()]:\n  torch.manual_seed(4); m=nn.Sequential(nn.Linear(2,8),act,nn.Linear(8,1)); print(type(act).__name__,sum(p.numel() for p in m.parameters()))",
      Research:"import torch\nfrom torch import nn\nfor seed in range(5):\n  torch.manual_seed(seed); m=nn.Sequential(nn.Linear(2,16),nn.ReLU(),nn.Linear(16,1)); x=torch.randn(64,2); y=m(x); print(seed, float(y.std()))"
    },
    "Convolutional Learning":{
      Foundation:"import torch\nfrom torch import nn\nx=torch.zeros(1,1,7,7); x[:,:,3,3]=1\nconv=nn.Conv2d(1,1,3,padding=1,bias=False)\nprint('out shape',conv(x).shape)",
      Derivation:"H,K,S,P=32,3,2,1\nout=(H+2*P-K)//S+1\nprint('output side',out,'parameters',16*(8*K*K+1))",
      Implementation:"import torch\nfrom torch import nn\nx=torch.randn(2,3,16,16); conv=nn.Conv2d(3,5,3,padding=1)\nprint(conv(x).shape)",
      Engineering:"import torch\nfrom torch import nn\nx=torch.randn(4,3,12,12); m=nn.Conv2d(3,6,3,padding=1)\ny=m(x); assert y.shape==(4,6,12,12) and torch.isfinite(y).all(); print('contract ok')",
      Experiment:"import torch\nfrom torch import nn\nfor k,s in [(3,1),(3,2),(5,1)]:\n  m=nn.Conv2d(3,8,k,stride=s,padding=k//2); x=torch.randn(2,3,32,32); print(k,s,m(x).shape,sum(p.numel() for p in m.parameters()))",
      Research:"import torch\nfrom torch import nn\nfor depth in [1,2,3]:\n  layers=[]\n  for _ in range(depth): layers += [nn.Conv2d(1,8,3,padding=1),nn.ReLU()]\n  m=nn.Sequential(*layers); print('depth',depth,'params',sum(p.numel() for p in m.parameters()))"
    },
    "Sequence Models":{
      Foundation:"import torch\nx=torch.randn(2,5,3); r=torch.nn.RNN(3,4,batch_first=True); y,h=r(x); print(y.shape,h.shape)",
      Derivation:"import torch\nT=6; hidden=4\nprint('recurrent dependency steps',T,'hidden size',hidden,'BPTT links',T-1)",
      Implementation:"import torch\nfrom torch import nn\nrnn=nn.RNN(3,5,batch_first=True); x=torch.randn(4,7,3); y,h=rnn(x); print(y.shape,h.shape)",
      Engineering:"import torch\nfrom torch import nn\nrnn=nn.LSTM(3,5,batch_first=True); x=torch.randn(4,7,3); y,(h,c)=rnn(x); assert y.shape==(4,7,5); print('contract ok')",
      Experiment:"import torch\nfor T in [8,32,128]:\n  x=torch.randn(4,T,3); r=torch.nn.RNN(3,8,batch_first=True); y,_=r(x); print('T',T,'std',float(y.std()))",
      Research:"import torch\nfrom torch import nn\nfor T in [8,32,64]:\n  torch.manual_seed(3); r=nn.LSTM(1,8,batch_first=True); x=torch.randn(16,T,1); y,_=r(x); print('T',T,'output_std',float(y.std()))"
    },
    "Transformer Foundations":{
      Foundation:"import torch\nx=torch.randn(1,4,8); q=k=v=x; scores=q@k.transpose(-2,-1)/(8**0.5); print(scores.shape)",
      Derivation:"import torch\nQ=torch.randn(1,4,8); K=torch.randn(1,4,8); V=torch.randn(1,4,6); A=torch.softmax(Q@K.transpose(-2,-1)/(8**0.5),-1); print(A.shape,(A.sum(-1)-1).abs().max().item())",
      Implementation:"import torch\ndef attention(q,k,v):\n  s=q@k.transpose(-2,-1)/(q.shape[-1]**0.5); a=torch.softmax(s,-1); return a@v,a\nq=k=v=torch.randn(1,5,8); out,a=attention(q,k,v); print(out.shape,a.shape)",
      Engineering:"import torch\nq=torch.randn(2,6,8); k=q.clone(); mask=torch.triu(torch.ones(6,6,dtype=torch.bool),1); s=q@k.transpose(-2,-1)/(8**0.5); s=s.masked_fill(mask,-float('inf')); a=torch.softmax(s,-1); assert torch.isfinite(a).all() and torch.allclose(a.sum(-1),torch.ones_like(a.sum(-1))); print('mask contract ok')",
      Experiment:"import torch,time\nfor n in [32,64,128,256]:\n  q=torch.randn(1,n,64); t=time.perf_counter(); _=q@q.transpose(-2,-1); print('n',n,'score_elements',n*n,'ms',(time.perf_counter()-t)*1000)",
      Research:"import torch\nfor n in [8,16,32]:\n  x=torch.randn(2,n,16); scores=x@x.transpose(-2,-1)/(16**0.5); a=torch.softmax(scores,-1); print('n',n,'mean_entropy',float(-(a.clamp_min(1e-9)*a.clamp_min(1e-9).log()).sum(-1).mean()))"
    },
    "Training Dynamics":{
      Foundation:"import torch\nfrom torch import nn\nm=nn.Linear(3,1); opt=torch.optim.SGD(m.parameters(),lr=.1); print('params',sum(p.numel() for p in m.parameters()),'lr',opt.param_groups[0]['lr'])",
      Derivation:"import torch\nw=torch.tensor([1.0],requires_grad=True); loss=(w-4)**2; loss.backward(); eta=.1; new=w.detach()-eta*w.grad; print('gradient',w.grad.item(),'next',new.item())",
      Implementation:"import torch\nfrom torch import nn\nm=nn.Linear(2,1); opt=torch.optim.Adam(m.parameters(),lr=.01); x=torch.randn(32,2); y=torch.randn(32,1)\nloss=nn.functional.mse_loss(m(x),y); opt.zero_grad(); loss.backward(); opt.step(); print('loss',loss.item())",
      Engineering:"import torch\nfrom torch import nn\nm=nn.Linear(2,1); x=torch.randn(16,2); y=m(x); loss=y.square().mean(); loss.backward(); g=torch.nn.utils.clip_grad_norm_(m.parameters(),1.0); assert torch.isfinite(torch.as_tensor(g)); print('grad_norm_before_clip',float(g))",
      Experiment:"import torch\nfrom torch import nn\nfor lr in [.001,.01,.1]:\n  torch.manual_seed(2); m=nn.Linear(1,1); opt=torch.optim.SGD(m.parameters(),lr=lr); x=torch.arange(20.).unsqueeze(1); y=2*x+1\n  for _ in range(30): opt.zero_grad(); loss=((m(x)-y)**2).mean(); loss.backward(); opt.step()\n  print('lr',lr,'loss',float(loss))",
      Research:"import torch\nfrom torch import nn\nfor seed in range(5):\n  torch.manual_seed(seed); m=nn.Linear(1,1); x=torch.linspace(-1,1,64).unsqueeze(1); y=3*x+torch.randn_like(x)*.1; opt=torch.optim.SGD(m.parameters(),lr=.1)\n  for _ in range(40): opt.zero_grad(); loss=((m(x)-y)**2).mean(); loss.backward(); opt.step()\n  print(seed,float(loss))"
    }
  };

  const answers={
    Foundation:["The core invariant is that tensor shapes, parameter roles and forward/backward semantics remain explicit.","The explanation is challenged when a valid tiny example violates the predicted tensor transformation or training behavior.","Convincing evidence includes a reproducible computation, explicit shapes, independent checks and a mechanistic explanation."],
    Derivation:["Every derivative step must follow from the chain rule or the stated tensor operation.","A dimension mismatch, missing derivative factor or numerical contradiction is evidence of an incorrect derivation.","A tiny numerical case plus an independent gradient check provides strong local verification."],
    Implementation:["Correctness means the implementation matches the specified computation and handles invalid or edge inputs deliberately.","Reference mismatch, failed gradient checks or violated shape/mask contracts can falsify the implementation.","Use deterministic inputs, assertions, independent references and numerical tolerances."],
    Engineering:["The engineering invariant is that tensor, data, numerical and training contracts remain valid during execution.","A diagnosis is weakened when the proposed cause cannot reproduce the symptom or measurements contradict it.","A complete fix includes symptom, hypothesis, diagnostic evidence, root cause, fix and regression test."],
    Experiment:["The experiment requires a fixed baseline, one meaningful intervention and predefined metrics.","The hypothesis is weakened when the effect is absent, unstable across repetitions or explained by an uncontrolled factor.","Reproducibility requires data, configuration, seeds where appropriate, metrics and analysis."],
    Research:["A research claim must specify the comparison, protocol and falsification condition.","A result opposite to the prediction or disappearing under controlled repetition can falsify the claim.","A strong result states the evidence, uncertainty, limitations and next experiment."]
  };

  const lessons=LESSONS.filter(x=>x.module==="m3");
  const authored=lessons.filter(x=>!x.title.includes("· Practice ") && !x.title.includes("· Transfer Case") && !x.title.includes("· Diagnostic Case") && !x.title.includes("· Scale Case") && !x.title.includes("· Ablation Case") && !x.title.includes("· Adversarial Case") && !x.title.includes("· Systems Case") && !x.title.includes("· Research Case")).slice(0,30);
  let i=0;
  for(const unit of Object.keys(P)){
    const p=P[unit];
    for(const stage of stages){
      const l=authored[i++];
      if(!l) continue;
      const s=stageInfo[stage], steps=p.steps[stage];
      l.title=stage+" · "+unit+" · "+s.title;
      l.lessonTitle=l.title;
      l.type=s.type;
      l.minutes=stage==="Foundation"?45:stage==="Derivation"?60:stage==="Implementation"?70:stage==="Engineering"?75:stage==="Experiment"?85:100;
      l.objective=steps[0]+" "+steps[1];
      l.prerequisite=stage==="Foundation"?"Module 01 foundations plus Module 02 supervised-learning and evaluation concepts.":stages[stages.indexOf(stage)-1]+" in this unit";
      l.whyItMatters=p.why;
      l.lessonBody=s.body+" "+p.focus+".";
      l.lessonBodyExtra="Deep-learning progression: computational graph → derivatives → implementation → architecture diagnostics → controlled training → falsifiable research.";
      l.mentalModel=p.mental;
      l.vocabulary=p.vocab;
      l.math=stageMath[unit][stage];
      l.mechanism=stage==="Foundation"?"Trace tensor → operation → representation → observable behavior.":stage==="Derivation"?"Trace definition → scalar operation → chain rule → tensor derivative.":stage==="Implementation"?"Trace equation → tensor operation → reference check → test.":stage==="Engineering"?"Trace symptom → violated tensor/training contract → diagnostic → root cause → regression test.":stage==="Experiment"?"Trace hypothesis → controlled variable → baseline → repeated training → interpretation.":"Trace research question → falsification condition → protocol → evidence → limitation.";
      l.implementation=p.implementation;
      l.experiment=p.experiment;
      l.failure=p.failure;
      l.evidence="Demonstrate the stage capability with explicit tensor reasoning, reproducible code, measurements or analysis rather than completion alone.";
      l.deliverable=stage==="Foundation"?"A clear architecture explanation and minimal tensor example.":stage==="Derivation"?"A first-principles derivation plus numerical gradient or shape verification.":stage==="Implementation"?"Working PyTorch implementation, tests and reference comparison.":stage==="Engineering"?"A root-cause training/architecture diagnosis, fix and regression test.":stage==="Experiment"?"A reproducible training benchmark with baseline, repeats and limitations.":"A concise deep-learning research note with hypothesis, protocol, results and limitations.";
      l.workedExample={title:"Worked example",text:p.examples[0],steps:["State the tensor inputs and assumptions.","Trace the computation one operation at a time.","Predict the output shape or gradient behavior.","Verify independently and explain the result."]};
      l.secondExample={title:"Second example",text:p.examples[1],steps:["State the architecture or training condition.","Predict the qualitative behavior.","Run the smallest reproducible case.","Compare prediction with observation."]};
      l.practice=[...steps,"Explain one failure mode without relying on a framework error message.","State one assumption that limits the method.","Write one test or measurement that could falsify your explanation."];
      l.beginnerWarnings=[...p.mental.slice(0,2),...p.misconceptions.slice(0,2),"Do not diagnose a training failure from loss alone."];
      l.lab={title:stage+" lab",objective:s.title+" for "+unit+".",steps,success:p.lab};
      l.misconceptions=p.misconceptions;
      l.takeaway="Deep learning becomes reliable when mathematical mechanism, tensor implementation, architecture and training evidence agree. "+p.mental[0];
      l.stageSteps=steps;
      l.code=stageCode[unit][stage];
      l.checkpoint=["What tensor, gradient, architectural or training invariant is this lesson testing?","What observation would falsify your current explanation?","What evidence would convince another engineer that the result is correct?"];
      l.checkpointAnswers=answers[stage].map((a,j)=>a+" Apply it here to: "+steps[j]);
      l.highlights=["Understand the computation graph before changing the model.","Track shapes and gradients as first-class evidence.","Separate optimization failures from architecture and data failures.","Use controlled experiments instead of intuition-only tuning."];
      l.keyNotes=["Unit focus: "+p.focus+".","Stage objective: "+steps[0],"Inspect tensors, gradients and training state before changing several variables.","Keep measured behavior separate from interpretation."];
    }
  }

  // Enrich generated Module 03 practice lessons with the same domain-specific reasoning.
  const practices=lessons.filter(x=>x.title.includes("· "));
  for(const l of practices){
    const p=P[l.unit];
    if(!p || !stageInfo[l.stage]) continue;
    const steps=p.steps[l.stage];
    l.moduleTitle=m.title;
    l.whyItMatters=p.why;
    l.mentalModel=p.mental;
    l.vocabulary=p.vocab;
    l.math=stageMath[l.unit][l.stage];
    l.lessonBody=stageInfo[l.stage].body+" "+p.focus+".";
    l.lessonBodyExtra="Transfer the deep-learning mechanism to a changed dataset, sequence length, architecture, numerical condition or training regime.";
    l.mechanism="baseline mechanism → changed condition → prediction → measurement → interpretation";
    l.implementation=p.implementation+" Add an explicit shape, gradient or numerical contract.";
    l.experiment=p.experiment+" Preserve the baseline and unsuccessful runs.";
    l.failure=p.failure+" Test whether the changed condition violates a hidden assumption.";
    l.evidence="Show the transfer with reproducible tensor reasoning, code and measurements; explain the failure boundary.";
    l.beginnerWarnings=[...p.misconceptions,"Do not change architecture, optimizer and data protocol simultaneously unless interaction is the question."];
    l.misconceptions=[...p.misconceptions,"A surprising training result is not automatically a bug; test the hypothesis."];
    l.takeaway="Transfer the mechanism, not just the code: identify what remains invariant when the context changes.";
    l.stageSteps=steps;
    l.checkpoint=["What changed from the baseline?","Which deep-learning invariant should remain true?","What evidence would show that the transfer failed?"];
    l.checkpointAnswers=answers[l.stage].map(a=>a);
    l.highlights=["Baseline first; intervention second.","Shapes, gradients and resource behavior are evidence.","A failed transfer can reveal an architectural boundary.","Preserve negative results."];
    l.keyNotes=["Unit focus: "+p.focus+".","Keep the changed condition explicit.","Do not infer causality from one training run."];
  }
  m.sourceNote="Original instructional synthesis based on the cited university curriculum, PyTorch documentation and the Transformer paper. It is not a reproduction of their lecture notes or assignments.";
})();