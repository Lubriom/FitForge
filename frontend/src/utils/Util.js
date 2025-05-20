function disableLeftClick() {
    window.addEventListener("click", blockClick, true);
  }
  
  function enableLeftClick() {
    window.removeEventListener("click", blockClick, true);
  }
  
  function blockClick(event) {
    if (event.button === 0) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

export { disableLeftClick, enableLeftClick };