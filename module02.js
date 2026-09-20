/* Research-backed Module 02 curriculum layer.
   Sources: Stanford CS229, UC Berkeley CS189, Carnegie Mellon 10-301/601,
   An Introduction to Statistical Learning with Python, and MIT 6.390.
*/
(() => {
  const m = CURRICULUM.modules.find(x => x.id === "m2");
  if (!m) return;

  m.desc = "Classical machine learning from statistical foundations to reliable model selection, validation and engineering.";
  m.tags = ["Classical ML","Statistics","Evaluation","Python"];
  m.researchBasis = [
    {institution:"Stanford University",course:"CS229 Machine Learning",focus:"supervised/unsupervised learning, learning theory, regularization and model selection",url:"https://cs229.stanford.edu/"},
    {institution:"UC Berkeley",course:"CS189 Introduction to Machine Learning",focus:"theoretical foundations, regression/classification, probabilistic models, clustering and dimensionality reduction",url:"https://www2.eecs.berkeley.edu/Courses/CS189/"},
    {institution:"Carnegie Mellon University",course:"10-301/10-601 Introduction to Machine Learning",focus:"algorithm implementation, formal properties, model selection and experiment design",url:"https://www.cs.cmu.edu/~mgormley/courses/10601/"},
    {institution:"ISLP authors",course:"An Introduction to Statistical Learning with Python",focus:"regression, classification, resampling, regularization, nonlinear methods, trees, SVM and unsupervised learning",url:"https://www.statlearning.com/"},
    {institution:"MIT",course:"6.390 Introduction to Machine Learning",focus:"modeling/prediction, overfitting, generalization, regression, classification and clustering",url:"https://introml.mit.edu/notes/"}
  ];
  m.masteryGate = {
    title:"Module 02 Mastery Gate",
    criteria:[
      "Explain the statistical assumptions and inductive bias of at least three classical ML families.",
      "Implement one supervised learner from first principles and verify it against a trusted reference.",
      "Design a leakage-safe train/validation/test protocol and justify the chosen metric.",
      "Compare at least two model families using repeated, controlled evaluation.",
      "Diagnose one model failure using residuals, calibration, feature behavior or error slices.",
      "Write a concise technical conclusion that separates measured evidence from interpretation."
    ],
    capabilities:["Statistical reasoning","Classical ML implementation","Model selection","Evaluation design","Failure diagnosis","Technical communication"],
    deliverable:"Complete the required implementations, evaluations, debugging work and technical reflection. The platform can use the resulting work to determine mastery."
  };

  const stages = ["Foundation","Derivation","Implementation","Engineering","Experiment","Research"];
  const stageInfo = {
    Foundation:{type:"concept",title:"Core Model & Intuition",body:"Build the statistical mental model before reaching for a library. Identify the learning problem, assumptions, objective and observable behavior."},
    Derivation:{type:"derivation",title:"First-Principles Derivation",body:"Turn intuition into mathematics. Start from definitions, expose the objective or estimator, and verify transformations with dimensions or probability arguments."},
    Implementation:{type:"coding-task",title:"From Mathematics to Code",body:"Implement the smallest correct algorithmic version, then compare it against an independent reference. Keep the mathematical object visible in the code."},
    Engineering:{type:"debug-task",title:"Debugging & Root Cause",body:"Treat an ML failure as a measurable hypothesis. Reproduce it, inspect invariants and data flow, test one explanation at a time, then lock the fix with a regression test."},
    Experiment:{type:"experiment",title:"Controlled Experiment",body:"Define the baseline, independent variable, metric and repetition protocol before inspecting results. Preserve failures and distinguish observation from interpretation."},
    Research:{type:"research-task",title:"Falsifiable Research Study",body:"Frame a narrow question that could be wrong. Define the protocol and falsification condition in advance, then report uncertainty, negative results and limits."}
  };

  const P = {
    "Regression & Classification":{
      focus:"linear regression, logistic regression, regularization, decision boundaries, probabilistic prediction and calibration",
      why:"Regression and classification expose the relationship between a hypothesis class, loss function, optimization procedure and generalization.",
      vocab:["Feature = input variable.","Target = quantity being predicted.","Hypothesis = function selected from a hypothesis class.","Loss = numerical prediction error.","Empirical risk = average loss on observed data.","Regularization = constraint or penalty controlling model complexity.","Logit = log-odds score; the sigmoid is its inverse mapping to a probability.","Calibration = agreement between predicted probabilities and observed frequencies."],
      mental:["A model is a parameterized function plus assumptions about how inputs relate to outputs.","Training minimizes an objective on observed data; generalization concerns unseen data.","Loss choice changes which mistakes are expensive.","Regularization changes effective model complexity; it does not repair bad data."],
      examples:["For y = 2x + 1, a one-unit increase in x changes the prediction by 2. This is coefficient interpretation, not a causal claim.","For logistic regression, p(y=1|x)=sigmoid(w^T x+b). A score of zero maps to probability 0.5."],
      math:"Derive least squares, logistic likelihood, log-loss and L2 regularization. Keep dimensions, assumptions and empirical versus expected risk explicit.",
      implementation:"Implement linear regression and logistic regression from scratch, then compare with scikit-learn.",
      experiment:"Measure underfitting, overfitting, regularization strength and probability calibration across repeated splits.",
      failure:"Feature leakage, unstable optimization, incorrect loss gradients, class imbalance, threshold confusion and overconfident probabilities.",
      lab:"Build a supervised benchmark with a linear baseline, logistic model, regularized model and calibration check.",
      misconceptions:["High training accuracy does not imply good generalization.","A coefficient is not automatically a causal effect.","A predicted probability is not a guarantee for an individual example."],
      steps:{
        Foundation:["Distinguish regression from classification and identify target type.","Explain hypothesis, loss and empirical risk.","Interpret a linear model without turning association into causation."],
        Derivation:["Derive the least-squares objective.","Derive the logistic log-likelihood and gradient.","Show how L2 regularization changes the objective."],
        Implementation:["Implement linear regression from scratch.","Implement logistic regression with stable sigmoid and log-loss.","Compare outputs with a trusted library on the same split."],
        Engineering:["Diagnose a diverging optimizer or exploding loss.","Check preprocessing and target leakage.","Add regression tests for gradients, shapes and probability bounds."],
        Experiment:["Sweep regularization strength with a fixed protocol.","Compare accuracy, log-loss and calibration.","Repeat across seeds and report variability."],
        Research:["Test whether stronger regularization improves calibration on a controlled synthetic task.","Predefine the comparison and falsification condition.","Report positive and negative results."]
      },
      code:"import numpy as np\\nrng = np.random.default_rng(7)\\nX = rng.normal(size=(200, 2))\\ny = 2.0*X[:,0] - 0.5*X[:,1] + rng.normal(scale=0.4, size=200)\\nX1 = np.c_[np.ones(len(X)), X]\\nw = np.linalg.solve(X1.T @ X1 + 1e-6*np.eye(3), X1.T @ y)\\npred = X1 @ w\\nprint('weights:', w)\\nprint('mse:', np.mean((pred-y)**2))"
    },
    "Trees & Ensembles":{
      focus:"decision trees, split criteria, pruning, bagging, random forests, boosting and ensemble bias-variance behavior",
      why:"Trees make nonlinear decision rules explicit. Ensembles show how averaging or sequential correction can change variance, bias and robustness.",
      vocab:["Impurity = measure of label mixing in a node.","Split gain = reduction in the chosen impurity criterion; call it information gain specifically when using an entropy-based criterion.","Leaf = terminal tree region.","Pruning = restricting tree complexity.","Bagging = fitting models on bootstrap samples and aggregating them.","Random forest = bagged trees with feature randomness.","Boosting = sequentially adding learners focused on current errors.","Weak learner = a learner that is only modestly predictive, typically better than chance on the relevant task and often used as a simple base learner."],
      mental:["A tree partitions feature space into regions.","Deep trees can memorize training data.","Bagging mainly reduces variance by averaging unstable learners.","Random feature selection decorrelates trees.","Boosting is sequential, so learning rate and number of stages interact."],
      examples:["A depth-1 tree is a threshold rule such as x1 < 3.2.","A random forest averages differently perturbed trees, reducing dependence on any one training example."],
      math:"Derive Gini impurity, entropy and variance reduction. Relate tree depth and ensemble averaging to bias-variance behavior.",
      implementation:"Implement Gini impurity and a decision stump from scratch, then inspect random forest and boosting behavior.",
      experiment:"Vary tree depth, number of trees and boosting learning rate under a fixed protocol.",
      failure:"Overgrown trees, correlated ensemble members, unstable importance and leakage before bootstrapping.",
      lab:"Train a stump, tree, random forest and boosting model on the same data and inspect errors and complexity.",
      misconceptions:["Deep is not automatically better.","Feature importance is not causal attribution.","A random forest is not simply one large tree."],
      steps:{
        Foundation:["Explain how a tree partitions feature space.","Calculate impurity for a small node.","Explain why depth changes flexibility."],
        Derivation:["Derive Gini impurity and weighted child impurity.","Derive information gain.","Explain why averaging unstable trees can reduce variance."],
        Implementation:["Implement Gini impurity.","Implement a decision-stump split search.","Compare stump predictions with a reference."],
        Engineering:["Diagnose a tree that memorizes training rows.","Check preprocessing leakage.","Inspect feature-importance stability across seeds."],
        Experiment:["Measure depth versus train/test error.","Compare bagging and random forests across repeats.","Sweep boosting learning rate and stage count together."],
        Research:["Test whether decorrelating base learners changes ensemble variance.","Use repeated bootstrap samples.","Report where the effect does not hold."]
      },
      code:"import numpy as np\\ndef gini(y):\\n    _, c = np.unique(y, return_counts=True)\\n    p = c/len(y)\\n    return 1.0 - np.sum(p*p)\\ny = np.array([0,0,0,1,1,1])\\nleft, right = y[:3], y[3:]\\nweighted = (len(left)*gini(left)+len(right)*gini(right))/len(y)\\nprint('gain:', gini(y)-weighted)"
    },
    "Unsupervised Learning":{
      focus:"k-means, Gaussian mixtures, expectation-maximization, PCA and structure discovery without labels",
      why:"Unsupervised learning forces careful thinking about objective functions, assumptions and what counts as meaningful structure when labels are absent.",
      vocab:["Cluster = group defined by a similarity rule or model.","Centroid = representative mean vector.","Inertia = within-cluster squared-distance objective.","Latent variable = unobserved model variable.","Mixture model = combination of component distributions.","EM = iterative expectation-maximization procedure.","Principal component = high-variance direction.","Explained variance = variance represented by selected components."],
      mental:["Clustering does not reveal objectively true groups without a supporting question.","K-means assumes Euclidean geometry through its objective.","GMM gives soft component membership under probabilistic assumptions.","PCA finds orthogonal directions of maximal variance, not guaranteed semantic features or predictive directions."],
      examples:["Two dense point clouds separated along one axis can be recovered by k-means if Euclidean distance matches the structure.","PCA can compress correlated measurements into fewer directions while retaining much variance."],
      math:"Derive the k-means objective and alternating steps. Derive PCA from covariance eigenvectors and connect GMM EM to latent responsibilities.",
      implementation:"Implement k-means with multiple initializations and a small PCA using eigendecomposition or SVD.",
      experiment:"Vary cluster count, initialization, scaling and dimensionality while inspecting stability and downstream utility.",
      failure:"Scale dominance, poor initialization, singular covariance, metric-only selection and semantic overinterpretation.",
      lab:"Create synthetic data with known geometry and compare k-means, GMM and PCA.",
      misconceptions:["A cluster is not automatically a real-world category.","PCA does not maximize predictive accuracy.","Silhouette score does not prove semantic usefulness."],
      steps:{
        Foundation:["Explain labeled versus unlabeled learning.","Show why distance and scale matter.","Explain PCA as a coordinate transformation."],
        Derivation:["Derive the k-means objective.","Explain why assignment/update steps reduce the objective locally.","Derive PCA from the maximum-variance direction."],
        Implementation:["Implement k-means assignments and updates.","Implement PCA with centering and SVD.","Compare against trusted references."],
        Engineering:["Diagnose empty clusters and poor initialization.","Detect scale-driven cluster changes.","Handle numerical issues in covariance or mixture calculations."],
        Experiment:["Measure clustering stability across initializations.","Compare k-means and GMM on matched synthetic data.","Measure PCA reconstruction error as dimensions are reduced."],
        Research:["Test whether clustering stability predicts downstream usefulness.","Define stability and usefulness before running the study.","Report cases where the relationship fails."]
      },
      code:"import numpy as np\\nrng = np.random.default_rng(11)\\nX = np.vstack([rng.normal((-2,0),0.5,(100,2)), rng.normal((2,0),0.5,(100,2))])\\ncenters = X[[0,-1]].copy()\\nfor _ in range(20):\\n    d = ((X[:,None,:]-centers[None,:,:])**2).sum(axis=2)\\n    labels = d.argmin(axis=1)\\n    new = np.vstack([X[labels==k].mean(axis=0) for k in range(2)])\\n    if np.allclose(new,centers): break\\n    centers = new\\nprint('centers:', centers)"
    },
    "Evaluation & Validation":{
      focus:"train/validation/test design, cross-validation, bootstrap, metrics, uncertainty, calibration, leakage and error analysis",
      why:"Evaluation is where a technically correct model can still produce a scientifically invalid conclusion. The protocol is part of the model claim.",
      vocab:["Training set = data used to fit parameters.","Validation set = data used for model choices.","Test set = held-out final assessment.","Cross-validation = repeated held-out fitting/evaluation.","Bootstrap = resampling the observed sample with replacement to approximate sampling variability under assumptions about how the sample represents the population.","Precision = fraction of predicted positives that are correct.","Recall = fraction of actual positives recovered.","Leakage = information crossing a boundary where it should not be available."],
      mental:["A test set is not a second validation set.","Metric choice encodes which errors matter.","Cross-validation reduces dependence on one arbitrary split, but preprocessing and model-selection steps must still be performed within the appropriate folds; a final test set remains separate when an unbiased final assessment is required.","Uncertainty belongs beside a point estimate when sampling variability matters."],
      examples:["Scaling the full dataset before a split leaks test-set statistics into training.","For a rare positive class, accuracy can be high while recall is nearly zero."],
      math:"Define confusion-matrix metrics, expected loss, sampling variability and cross-validation estimators. Distinguish model assessment from model selection.",
      implementation:"Build a leakage-safe evaluation function that fits preprocessing only inside training folds and reports multiple metrics.",
      experiment:"Compare single split, cross-validation and bootstrap uncertainty on repeated synthetic datasets.",
      failure:"Preprocessing leakage, target leakage, repeated test tuning, metric mismatch and optimistic uncertainty estimates.",
      lab:"Introduce three evaluation mistakes into one pipeline, detect them and repair the protocol.",
      misconceptions:["A test set is not for tuning.","A single metric cannot describe every task.","Cross-validation does not fix a contaminated dataset."],
      steps:{
        Foundation:["Separate training, validation and test roles.","Choose metrics from the decision problem.","Identify a concrete leakage example."],
        Derivation:["Derive precision, recall and F-score.","Explain cross-validation as repeated held-out estimation.","Explain bootstrap as an approximation to sampling variability."],
        Implementation:["Build a leakage-safe preprocessing pipeline.","Implement metric calculations and sanity checks.","Compare results with a trusted library."],
        Engineering:["Find target leakage in a feature table.","Diagnose an accidentally reused test set.","Automate checks for split boundaries and fit scope."],
        Experiment:["Compare validation protocols on repeated datasets.","Measure metric variability.","Test whether model ordering changes with the primary metric."],
        Research:["Test how evaluation protocol choice changes model ranking.","Predefine the ranking rule and uncertainty summary.","Report when ordering is unstable."]
      },
      code:"import numpy as np\\nfrom sklearn.model_selection import train_test_split\\nfrom sklearn.pipeline import make_pipeline\\nfrom sklearn.preprocessing import StandardScaler\\nfrom sklearn.linear_model import LogisticRegression\\nfrom sklearn.metrics import accuracy_score, log_loss\\nrng=np.random.default_rng(3)\\nX=rng.normal(size=(500,4)); y=(X[:,0]+0.5*X[:,1]+rng.normal(size=500)>0).astype(int)\\nXt,Xe,yt,ye=train_test_split(X,y,test_size=.2,stratify=y,random_state=3)\\nmodel=make_pipeline(StandardScaler(),LogisticRegression(max_iter=1000)).fit(Xt,yt)\\np=model.predict_proba(Xe)[:,1]\\nprint('accuracy:',accuracy_score(ye,p>=.5)); print('log_loss:',log_loss(ye,p))"
    },
    "ML Engineering Patterns":{
      focus:"baselines, preprocessing pipelines, reproducibility, model diagnostics, selection and end-to-end classical ML workflows",
      why:"A classical model becomes useful only when the whole workflow is reproducible. Data preparation, baselines, fitting, validation, diagnostics and reporting must agree.",
      vocab:["Baseline = simple reference system.","Pipeline = ordered reproducible transformations and modeling steps.","Feature engineering = constructing inputs from available information.","Hyperparameter = configuration chosen outside fitted parameters.","Residual = observed minus predicted value.","Slice = defined subgroup used for error analysis.","Reproducibility = ability to reproduce an intended result under a documented protocol."],
      mental:["Start with a baseline before optimizing.","Every transformation needs a defined fit scope.","Diagnostics should reveal where the model fails.","Reproducibility involves data, code, configuration and randomness.","Model selection is an experiment, not a leaderboard screenshot."],
      examples:["A mean predictor is a valid regression baseline because every complex model should beat it under the same protocol.","A pipeline that imputes, scales and fits a classifier prevents common cross-validation leakage when used correctly."],
      math:"Relate baseline risk, residual structure, metric variance and hyperparameter selection to statistical learning.",
      implementation:"Build an end-to-end pipeline with preprocessing, baseline, candidate models, cross-validation and diagnostics.",
      experiment:"Compare baseline-first and model-first workflows and measure whether conclusions change when diagnostics are included.",
      failure:"Hidden state, nondeterministic preprocessing, inconsistent feature schemas, invalid baseline comparisons and metric optimization detached from the task.",
      lab:"Build a reproducible classical ML project with configuration, baseline, candidates, cross-validation and error slices.",
      misconceptions:["A complex model is not a baseline.","A seed alone does not guarantee reproducibility.","Global metrics can hide important subgroup failures."],
      steps:{
        Foundation:["Define a baseline and explain why it matters.","Trace data through preprocessing and modeling.","Explain why reproducibility includes configuration and randomness."],
        Derivation:["Relate baseline risk to candidate improvement.","Explain why preprocessing inside a pipeline changes cross-validation validity.","Explain model-selection decision points."],
        Implementation:["Build a baseline and two candidate pipelines.","Add cross-validation and structured result output.","Create reproducible configuration and seed handling."],
        Engineering:["Diagnose inconsistent feature schemas or hidden state.","Trace a metric regression to a pipeline change.","Add tests for preprocessing scope and reproducibility."],
        Experiment:["Compare models with a predefined protocol.","Analyze global metrics and error slices together.","Measure sensitivity to seeds and split choices."],
        Research:["Study whether slice diagnostics reveal failures hidden by aggregate metrics.","Predefine slice criteria and reporting rules.","Report false positives, false negatives and limitations without cherry-picking."]
      },
      code:"from sklearn.datasets import load_breast_cancer\\nfrom sklearn.model_selection import StratifiedKFold, cross_validate\\nfrom sklearn.pipeline import make_pipeline\\nfrom sklearn.preprocessing import StandardScaler\\nfrom sklearn.linear_model import LogisticRegression\\nX,y=load_breast_cancer(return_X_y=True)\\nmodel=make_pipeline(StandardScaler(),LogisticRegression(max_iter=2000))\\ncv=StratifiedKFold(n_splits=5,shuffle=True,random_state=42)\\ns=cross_validate(model,X,y,cv=cv,scoring=['accuracy','roc_auc'])\\nprint('accuracy mean:',s['test_accuracy'].mean()); print('roc_auc mean:',s['test_roc_auc'].mean())"
    }
  };

  const answers = {
    Foundation:["The invariant is that the learning problem, data roles and model assumptions are explicit before fitting.","The explanation is challenged when a valid example violates predicted behavior or a required assumption is absent.","A convincing result is reproducible from the same inputs and protocol and can be explained mechanistically."],
    Derivation:["Each mathematical step must preserve the meaning of the original objective or probability statement.","A dimension mismatch, unjustified algebraic step or numerical contradiction is evidence of an error.","Independent numerical verification on a small case checks the symbolic result."],
    Implementation:["Correctness means code matches the mathematical specification on valid inputs and handles invalid inputs explicitly.","A reference mismatch, failed edge case or violated invariant can falsify the implementation.","Use tests, randomized comparisons and an explicit equation-to-code mapping."],
    Engineering:["The engineering invariant is that data boundaries, model contracts and evaluation assumptions remain valid while the system runs.","The failure hypothesis is weakened when the symptom cannot be reproduced or measurements contradict the proposed cause.","A complete diagnosis contains symptom, hypothesis, measurement, root cause, fix and regression test."],
    Experiment:["A controlled experiment needs a stable protocol, one deliberately changed variable and predefined measurement.","The hypothesis is weakened when the predicted effect is absent, unstable or explained by an uncontrolled variable.","Reproducibility requires configuration, data handling, seeds where relevant, metrics and analysis."],
    Research:["A research claim must specify what is compared, under which assumptions, and what would count against it.","A consistent result opposite to the prediction, or disappearance under a controlled condition, can falsify it.","A strong result states what the evidence supports, what it does not establish, and what should be tested next."]
  };

  const m2Lessons = LESSONS.filter(x => x.module === "m2" && !x.title.includes("· Practice ")).slice(0, 30);
  let i=0;
  for (const unit of Object.keys(P)) {
    const p=P[unit];
    for (const stage of stages) {
      const l=m2Lessons[i++];
      const s=stageInfo[stage];
      const steps=p.steps[stage];
      l.title=stage+" · "+unit+" · "+s.title;
      l.lessonTitle=l.title;
      l.type=s.type;
      l.minutes=stage==="Foundation"?40:stage==="Derivation"?50:stage==="Implementation"?60:stage==="Engineering"?65:stage==="Experiment"?75:90;
      l.objective=steps[0]+" "+steps[1];
      l.prerequisite=stage==="Foundation"?"Module 01 foundations: probability, linear algebra, calculus and Python.":stages[stages.indexOf(stage)-1]+" in this unit";
      l.whyItMatters=p.why;
      l.lessonBody=s.body+" "+p.focus+".";
      l.lessonBodyExtra="Research alignment: the lesson combines statistical reasoning, algorithmic implementation, formal assumptions and empirical evaluation, following the theory → implementation → experiment progression found across the selected university curricula.";
      l.mentalModel=p.mental;
      l.vocabulary=p.vocab;
      l.math=p.math;
      l.mechanism="Trace data and assumptions → hypothesis class → objective or estimator → fitted model → prediction → evaluation.";
      l.implementation=p.implementation;
      l.experiment=p.experiment;
      l.failure=p.failure;
      l.evidence="Demonstrate the stage capability with reproducible reasoning, code, measurements or analysis rather than completion alone.";
      l.deliverable=stage==="Foundation"?"A clear explanation and minimal working example.":stage==="Derivation"?"A first-principles derivation plus numerical verification.":stage==="Implementation"?"Working implementation, tests and reference comparison.":stage==="Engineering"?"A root-cause diagnosis, fix and regression test.":stage==="Experiment"?"A reproducible benchmark with baseline, repeated measurements and limitations.":"A concise research note with hypothesis, protocol, results and limitations.";
      l.workedExample={title:"Worked example",text:p.examples[0],steps:["State the data and target.","Identify the model assumption or objective.","Compute or implement the smallest useful case.","Check the result independently and explain the consequence."]};
      l.secondExample={title:"Second example",text:p.examples[1],steps:["State the assumptions.","Predict the qualitative behavior.","Run the calculation or experiment.","Compare prediction and observation."]};
      l.practice=[...steps,"Explain one failure mode without relying on a library error message.","State one assumption that would make the method inappropriate.","Write one test or measurement that could falsify your current explanation."];
      l.beginnerWarnings=[...p.mental.slice(0,2),...p.misconceptions.slice(0,2),"Do not confuse a high score with a valid evaluation protocol."];
      l.lab={title:stage+" lab",objective:s.title+" for "+unit+".",steps,success:p.lab};
      l.misconceptions=p.misconceptions;
      l.takeaway="Classical ML becomes reliable when the statistical question, model assumptions, implementation and evaluation protocol agree. "+p.mental[0];
      l.stageSteps=steps;
      l.code=s.title+" · "+unit+"\\n"+p.code;
      l.checkpoint=["What statistical assumption, invariant or evaluation boundary is this lesson testing?","What observation would falsify your current explanation?","What evidence would convince another engineer that the result is correct?"];
      l.checkpointAnswers=answers[stage].map((a,j)=>a+" Apply it here to: "+steps[j]);
      l.highlights=["Understand the statistical question before selecting the algorithm.","Separate model fitting from model assessment.","Use assumptions and failure modes as part of the explanation.","Measure repeated behavior when one split is not enough."];
      l.keyNotes=["Unit focus: "+p.focus+".","Stage objective: "+steps[0],"Never use the test set as an iterative tuning loop.","Keep observed results separate from interpretation."];
    }
  }
  m.sourceNote="Original instructional synthesis based on the cited university curricula and textbooks. It is not a reproduction of their lecture notes or assignments.";
})();