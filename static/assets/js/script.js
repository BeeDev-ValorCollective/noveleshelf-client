const TARGET = new Date('2026-06-01T16:00:00Z').getTime();

// ── Elements ──
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const miniBtn = document.getElementById('mini-countdown');
const miniTicker = document.getElementById('mini-ticker');
const modalUnits = document.getElementById('modal-units');

const mDays = document.getElementById('m-days');
const mHours = document.getElementById('m-hours');
const mMins = document.getElementById('m-mins');
const mSecs = document.getElementById('m-secs');

function pad(n) { return String(n).padStart(2, '0'); }

// ── Tick ──
function tick() {
    const diff = TARGET - Date.now();

    if (diff <= 0) {
        // Modal launched state
        modalUnits.innerHTML = '<p class="modal-launched">We\'re live — welcome, authors!</p>';
        miniTicker.textContent = "We're live!";
        return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = pad(Math.floor((diff % 86400000) / 3600000));
    const mins = pad(Math.floor((diff % 3600000) / 60000));
    const secs = pad(Math.floor((diff % 60000) / 1000));

    // Modal numbers
    mDays.textContent = days;
    mHours.textContent = hours;
    mMins.textContent = mins;
    mSecs.textContent = secs;

    // Mini ticker: d : hh : mm : ss
    miniTicker.textContent = `${days}d : ${hours}h : ${mins}m : ${secs}s`;
}

tick();
setInterval(tick, 1000);

// ── Modal open/close ──
function openModal() {
    modal.classList.remove('hidden');
    modalClose.focus();
}
function closeModal() {
    modal.classList.add('hidden');
}

// Close via X button
modalClose.addEventListener('click', closeModal);

// Close via backdrop click (but not box click)
modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
});

// Close via Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

// Reopen via mini countdown
miniBtn.addEventListener('click', openModal);

// Auto-open on load
window.addEventListener('load', openModal);