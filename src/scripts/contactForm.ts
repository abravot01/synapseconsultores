interface FormData {
    nombre: string;
    email: string;
    mensaje: string;
    'h-captcha-response': string;
  }
  
  export async function handleSubmit(e: Event, form: HTMLFormElement, formStatus: HTMLDivElement) {
    e.preventDefault();
  
    const formData = new FormData(form);
    const data: Partial<FormData> = {};
  
    formData.forEach((value, key) => {
      data[key as keyof FormData] = value.toString();
    });
  
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        formStatus.textContent = '¡Mensaje enviado con éxito!';
        form.reset();
        // @ts-ignore
        hcaptcha.reset();
      } else {
        const errorData = await response.json();
        formStatus.textContent = errorData.error || 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
      }
    } catch (error) {
      console.error('Error:', error);
      formStatus.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
    }
  }