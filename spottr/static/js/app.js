/* ============================================
   SPOTTR - Main JavaScript
   ============================================ */

// --- Modal System ---
function openModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('show'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('show'); document.body.style.overflow = ''; }
}
// Close modal on overlay click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// --- Tabs ---
function switchTab(tabGroup, tabName) {
    const btns = document.querySelectorAll('[data-tab-group="' + tabGroup + '"]');
    const contents = document.querySelectorAll('[data-tab-content-group="' + tabGroup + '"]');
    btns.forEach(function(b) { b.classList.toggle('active', b.dataset.tab === tabName); });
    contents.forEach(function(c) { c.classList.toggle('active', c.dataset.tabContent === tabName); });
}

// --- Plus Menu ---
function togglePlusMenu() {
    var menu = document.getElementById('plusMenu');
    if (menu) menu.classList.toggle('show');
}
document.addEventListener('click', function(e) {
    var menu = document.getElementById('plusMenu');
    if (menu && menu.classList.contains('show')) {
        var btn = document.querySelector('.nav-plus-btn');
        if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            menu.classList.remove('show');
        }
    }
});

// --- Reactions ---
function toggleReaction(postId, reactionType, btn) {
    var csrf = document.querySelector('[name=csrfmiddlewaretoken]');
    var token = csrf ? csrf.value : '';
    fetch('/post/' + postId + '/react/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': token },
        body: 'reaction_type=' + reactionType
    }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.status === 'ok') {
            var countEl = btn.querySelector('.reaction-count');
            if (countEl) countEl.textContent = data.count;
            btn.classList.toggle('active', data.active);
        }
    }).catch(function() {
        // Toggle UI optimistically
        btn.classList.toggle('active');
        var countEl = btn.querySelector('.reaction-count');
        if (countEl) {
            var v = parseInt(countEl.textContent) || 0;
            countEl.textContent = btn.classList.contains('active') ? v + 1 : Math.max(0, v - 1);
        }
    });
}

// --- Workout Set Updates ---
function updateSet(setId, input) {
    var csrf = document.querySelector('[name=csrfmiddlewaretoken]');
    var token = csrf ? csrf.value : '';
    fetch('/workout/set/' + setId + '/update/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': token },
        body: 'weight=' + input.value
    });
}
function updateSetReps(setId, input) {
    var csrf = document.querySelector('[name=csrfmiddlewaretoken]');
    var token = csrf ? csrf.value : '';
    fetch('/workout/set/' + setId + '/update/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': token },
        body: 'reps=' + input.value
    });
}
function toggleSetComplete(setId, btn) {
    var csrf = document.querySelector('[name=csrfmiddlewaretoken]');
    var token = csrf ? csrf.value : '';
    btn.classList.toggle('checked');
    var row = btn.closest('.set-row');
    if (row) row.classList.toggle('set-completed');
    fetch('/workout/set/' + setId + '/update/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': token },
        body: 'toggle_complete=1'
    });
}

// --- Exercise Filter (Workout Builder) ---
function filterExercises(query) {
    var items = document.querySelectorAll('.exercise-select-item');
    var q = query.toLowerCase();
    items.forEach(function(item) {
        var name = item.dataset.name || '';
        item.style.display = name.indexOf(q) >= 0 ? '' : 'none';
    });
}
function filterByCategory(cat, btn) {
    var items = document.querySelectorAll('.exercise-select-item');
    items.forEach(function(item) {
        if (cat === 'all') { item.style.display = ''; }
        else { item.style.display = item.dataset.category === cat ? '' : 'none'; }
    });
    var pills = btn.parentElement.querySelectorAll('.tab-pill');
    pills.forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
}

// --- Activity Tag Toggle (Check-in) ---
document.addEventListener('click', function(e) {
    var tag = e.target.closest('.activity-tag');
    if (tag) tag.classList.toggle('selected');
});

// --- Hashtag Toggle (Post) ---
document.addEventListener('click', function(e) {
    var pill = e.target.closest('.hashtag-pill');
    if (pill && pill.dataset.tag) pill.classList.toggle('selected');
});

// --- Poll Creator ---
function addPollOption() {
    var container = document.getElementById('pollOptions');
    if (!container) return;
    var count = container.querySelectorAll('.poll-option-row').length;
    if (count >= 4) return;
    var row = document.createElement('div');
    row.className = 'poll-option-row';
    row.innerHTML = '<input type="text" name="poll_option_' + (count + 1) + '" class="form-input" placeholder="Option ' + (count + 1) + '">' +
        '<button type="button" class="icon-btn text-red" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>';
    container.appendChild(row);
}

// --- Toggle sections (Groups pending) ---
function toggleSection(id) {
    var section = document.getElementById(id);
    if (section) {
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
    }
}

// --- Password visibility ---
function togglePassword(inputId) {
    var input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// --- Post toolbar toggles ---
function toggleToolbar(btn, targetId) {
    btn.classList.toggle('active');
    var target = document.getElementById(targetId);
    if (target) target.style.display = target.style.display === 'none' ? 'block' : 'none';
}

// --- Image preview for file inputs ---
document.addEventListener('change', function(e) {
    if (e.target.type === 'file' && e.target.accept && e.target.accept.indexOf('image') >= 0) {
        var preview = e.target.closest('form') ? e.target.closest('form').querySelector('.camera-preview, .media-preview-row') : null;
        if (preview && e.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function(ev) {
                if (preview.classList.contains('camera-preview')) {
                    preview.innerHTML = '<img src="' + ev.target.result + '" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">';
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }
});

// --- Nudge animation ---
function nudgeUser(userId) {
    var csrf = document.querySelector('[name=csrfmiddlewaretoken]');
    var token = csrf ? csrf.value : '';
    fetch('/user/' + userId + '/nudge/', {
        method: 'POST',
        headers: { 'X-CSRFToken': token }
    }).then(function() {
        // Flash the zap button
        var btn = document.querySelector('[data-nudge="' + userId + '"]');
        if (btn) {
            btn.style.transform = 'scale(1.3)';
            setTimeout(function() { btn.style.transform = ''; }, 300);
        }
    });
}

// --- Init on page load ---
document.addEventListener('DOMContentLoaded', function() {
    // Auto-scroll chat
    var chat = document.getElementById('chatMessages');
    if (chat) chat.scrollTop = chat.scrollHeight;

    // Bio character counter
    var bio = document.getElementById('id_bio');
    var counter = document.getElementById('bioCount');
    if (bio && counter) {
        counter.textContent = bio.value.length + '/150';
        bio.addEventListener('input', function() {
            counter.textContent = bio.value.length + '/150';
        });
    }
});
