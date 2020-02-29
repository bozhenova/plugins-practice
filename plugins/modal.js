$.modal = function (options) {
  const $modal = _createModal(options);
  const ANIMATION_SPEED = 200;
  const DEFAULT_WIDTH = '600px';
  let closing = false;
  let destroyed = false;

  const modal = {
    open() {
      if (destroyed) {
        return;
      }
      !closing && $modal.classList.add('open');
    },
    close() {
      closing = true;
      $modal.classList.remove('open');
      $modal.classList.add('hidden');
      setTimeout(() => {
        $modal.classList.remove('hidden');
        closing = false;
        if (typeof options.onClose === 'function') {
          options.onClose();
        }
      }, ANIMATION_SPEED);
    }
  };

  const clickHandler = (e) => {
    if (e.target.dataset.close) {
      modal.close()
    }
  };

  $modal.addEventListener('click', clickHandler);

  function noop() { }

  function _createModalFooter(buttons = []) {
    if (buttons.length === 0) {
      return document.createElement('div');
    }

    const wrap = document.createElement('div');
    wrap.classList.add('modal-footer');

    buttons.forEach(btn => {
      const $btn = document.createElement('button');
      $btn.textContent = btn.text;
      $btn.classList.add('btn');
      $btn.classList.add(`btn-${btn.type || 'secondary'}`);
      $btn.onclick = btn.handler || noop;

      wrap.append($btn);
    });
    return wrap;
  }

  function _createModal(options) {
    const modal = document.createElement('div');
    modal.classList.add('mmodal');
    modal.insertAdjacentHTML('afterbegin', `
      <div class="modal-overlay" data-close="true">
        <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
          <div class="modal-header">
            <span class="modal-title">${options.title || 'Окно'}</span>
            ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''}
          </div>
          <div class="modal-body" data-content>
          ${options.content || ''}
          </div>
        </div>
      </div>`);
    const footer = _createModalFooter(options.footerButtons);
    modal.querySelector('[data-content]').after(footer);
    document.body.append(modal);
    return modal;
  }

  return Object.assign(modal, {
    destroy() {
      $modal.remove();
      $modal.removeEventListener('click', clickHandler);
      destroyed = true;
    },
    setContent(html) {
      $modal.querySelector('[data-content]').innerHTML = html;
    }
  });

}