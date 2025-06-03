import { ApplicationRef, ComponentRef, createComponent, inject, Injectable, Injector } from '@angular/core';
import { ToastComponent } from '../components/Toast/Toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private appRef: ApplicationRef) { }

  private appendToast(message: string, type: 'success' | 'error' | 'info') {
    const toastRef: ComponentRef<ToastComponent> = createComponent(ToastComponent, {
      environmentInjector: this.appRef.injector
    });

    toastRef.instance.message = message;
    toastRef.instance.type = type;

    this.appRef.attachView(toastRef.hostView);

    const domElem = (toastRef.hostView as any).rootNodes[0] as HTMLElement;
    domElem.id = 'toast-container';
    document.body.appendChild(domElem);

    // Limpieza después de desaparecer el toast
    setTimeout(() => {
      this.appRef.detachView(toastRef.hostView);
      toastRef.destroy();
    }, 3500);
  }

  success(message: string) {
    this.appendToast(message, 'success');
  }

  error(message: string) {
    this.appendToast(message, 'error');
  }

  info(message: string) {
    this.appendToast(message, 'info');
  }

}
