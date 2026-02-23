/* ============================================
   FitPath — 交互逻辑
   ============================================ */

// --- Quiz ---
const quizState = { step: 1, answers: {} };

const programDatabase = [
    { icon: '🏃', name: '4周极速燃脂', desc: '结合 HIIT 和力量训练，4周平均减重3-5kg', goal: 'lose', level: 'intermediate', freq: '4-5', equip: 'none' },
    { icon: '💃', name: '快乐燃脂舞蹈', desc: '零门槛舞蹈有氧，让减肥变得有趣', goal: 'lose', level: 'beginner', freq: '2-3', equip: 'none' },
    { icon: '🚴', name: '居家有氧燃脂', desc: '无需器材，在家就能高效燃脂', goal: 'lose', level: 'beginner', freq: '2-3', equip: 'none' },
    { icon: '🏋️', name: '新手增肌入门', desc: '从零开始，系统学习力量训练', goal: 'gain', level: 'beginner', freq: '4-5', equip: 'basic' },
    { icon: '💥', name: '进阶力量突破', desc: '5/3/1体系，突破力量平台期', goal: 'gain', level: 'advanced', freq: '4-5', equip: 'gym' },
    { icon: '🔱', name: '上肢力量专攻', desc: '胸肩背手臂全面发展', goal: 'gain', level: 'intermediate', freq: '4-5', equip: 'gym' },
    { icon: '🧘', name: '晨间瑜伽唤醒', desc: '每天15分钟，温和唤醒身体', goal: 'relax', level: 'beginner', freq: '6+', equip: 'none' },
    { icon: '🌊', name: '深度拉伸放松', desc: '改善柔韧性，缓解肌肉紧张', goal: 'relax', level: 'beginner', freq: '2-3', equip: 'none' },
    { icon: '🌙', name: '睡前冥想修复', desc: '10分钟冥想 + 拉伸，改善睡眠质量', goal: 'relax', level: 'beginner', freq: '6+', equip: 'none' },
    { icon: '🏀', name: '篮球体能强化', desc: '提升弹跳、速度和核心稳定性', goal: 'sport', level: 'intermediate', freq: '4-5', equip: 'gym' },
    { icon: '🏃‍♂️', name: '5K跑步训练营', desc: '8周从零到完成5公里', goal: 'sport', level: 'beginner', freq: '2-3', equip: 'none' },
    { icon: '🏊', name: '游泳速度提升', desc: '技术 + 体能双提升方案', goal: 'sport', level: 'intermediate', freq: '4-5', equip: 'gym' },
];

document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function () {
        const step = this.closest('.quiz-step');
        const stepNum = parseInt(step.dataset.step);
        const value = this.dataset.value;

        // Visual feedback
        step.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');

        // Save answer
        const keys = ['goal', 'level', 'freq', 'equip'];
        quizState.answers[keys[stepNum - 1]] = value;

        // Next step after short delay
        setTimeout(() => {
            step.classList.remove('active');
            const next = document.querySelector(`.quiz-step[data-step="${stepNum + 1}"]`);
            if (next) {
                next.classList.add('active');
                quizState.step = stepNum + 1;

                // If final step, show results
                if (stepNum + 1 === 5) {
                    showResults();
                }
            }
        }, 300);
    });
});

function showResults() {
    const a = quizState.answers;
    
    // Score programs
    const scored = programDatabase.map(p => {
        let score = 0;
        if (p.goal === a.goal) score += 50;
        
        const levelMap = { beginner: 'beginner', intermediate: 'intermediate', advanced: 'advanced' };
        if (p.level === a.level) score += 20;
        else if (
            (a.level === 'intermediate' && (p.level === 'beginner' || p.level === 'advanced')) ||
            (a.level === 'beginner' && p.level === 'intermediate')
        ) score += 10;
        
        if (p.freq === a.freq) score += 15;
        
        if (a.equip === 'gym') score += 10; // gym can do everything
        else if (a.equip === p.equip) score += 15;
        else if (a.equip === 'basic' && p.equip === 'none') score += 10;
        
        return { ...p, score };
    });
    
    // Sort and take top 3
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 3);
    
    const container = document.getElementById('resultCards');
    container.innerHTML = top.map((p, i) => {
        const matchPercent = Math.min(98, 80 + Math.floor(p.score / 5));
        return `
            <div class="result-card">
                <div class="result-card-icon">${p.icon}</div>
                <div class="result-card-info">
                    <h4>${p.name}</h4>
                    <p>${p.desc}</p>
                </div>
                <div class="result-card-match">${matchPercent}% 匹配</div>
            </div>
        `;
    }).join('');
}

function resetQuiz() {
    quizState.step = 1;
    quizState.answers = {};
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
    document.querySelector('.quiz-step[data-step="1"]').classList.add('active');
}

// --- Program Filters ---
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const filter = this.dataset.filter;

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Filter cards
        document.querySelectorAll('.program-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = '';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// --- Mobile Nav Toggle ---
const mobileToggle = document.getElementById('mobileToggle');
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        const nav = document.querySelector('.nav-links');
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '60px';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'white';
        nav.style.padding = '20px';
        nav.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
    });
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// --- Scroll animation for cards ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.goal-card, .program-card, .step-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    observer.observe(card);
});
