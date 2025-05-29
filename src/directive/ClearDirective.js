export const ClearDirective = {

    mounted: (el, binding) => {
        const span = document.createElement('span');
        span.className = 'searchClear';
        span.textContent = 'X';

        span.addEventListener('click', () => {
            binding.instance.clearVal(binding.value);
        });

        el.parentNode.appendChild(span);
    }
    
}