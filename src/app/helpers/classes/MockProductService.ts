import { BehaviorSubject, of } from "rxjs";
import { Product } from "../../products/interfaces/Products";

export class MockProductService {
  private mockProductSource = new BehaviorSubject<Product | null>(null);
  currentProduct = this.mockProductSource.asObservable();

  get = jasmine.createSpy('get').and.returnValue(of([]));
  delete = jasmine.createSpy('delete').and.returnValue(of(''));
  changeProduct = jasmine.createSpy('changeProduct').and.callFake((product: Product) => {
    this.mockProductSource.next(product);
  });
  post = jasmine.createSpy('post').and.returnValue(of({} as Product));
  put = jasmine.createSpy('put').and.returnValue(of({} as Product));
  verify = jasmine.createSpy('verify').and.returnValue(of(true));
}
