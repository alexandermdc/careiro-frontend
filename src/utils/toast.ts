type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  subtitle?: string;
}

const colorClasses: Record<ToastType, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500'
};

export const showToast = ({
  message,
  type = 'success',
  duration = 3000,
  subtitle
}: ToastConfig) => {
  const toast = document.createElement('div');
  const bgColor = colorClasses[type];
  
  toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
  
  if (subtitle) {
    toast.innerHTML = `
      <div>
        <p class="font-semibold">${message}</p>
        <p class="text-sm opacity-90 mt-1">${subtitle}</p>
      </div>
    `;
  } else {
    toast.textContent = message;
  }
  
  document.body.appendChild(toast);
  
  // Remover após duração especificada
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, duration);
};

// Atalhos para diferentes tipos
export const toast = {
  success: (message: string, subtitle?: string) => 
    showToast({ message, type: 'success', subtitle }),
  
  error: (message: string, subtitle?: string) => 
    showToast({ message, type: 'error', subtitle }),
  
  warning: (message: string, subtitle?: string) => 
    showToast({ message, type: 'warning', subtitle }),
  
  info: (message: string, subtitle?: string) => 
    showToast({ message, type: 'info', subtitle })
};

export default toast;
