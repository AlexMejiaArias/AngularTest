import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map, Observable } from 'rxjs';
import { Product } from '../interfaces/Products';
import { environment } from '../../../environment/environment';
import { ResponseGetAllProducts } from '../interfaces/response-get-all-products.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productSource = new BehaviorSubject<Product | null>(null);
  private idAuthor: string | null = localStorage.getItem('idAuthor')

  private headers = {
    'authorId': this.idAuthor || 'defaultId'
  };

  currentProduct = this.productSource.asObservable();

  private readonly baseUrl = environment.apiUrl;

  private http = inject(HttpClient)

  public get(): Observable<Product[]> {
    const url = `${this.baseUrl}/products`;
    return this.http.get<ResponseGetAllProducts>(url, { headers: this.headers }).pipe(
      map(response => response.data),
      catchError(() => EMPTY)
    );
  }


  changeProduct(product: Product) {
    this.productSource.next(product);
  }

  public post(body: Product): Observable<Product> {
    const url = `${this.baseUrl}/products`;
    return this.http.post<Product>(url, body, { headers: this.headers });
  }


  public put(product: Product): Observable<Product> {
    const url = `${this.baseUrl}/products/${product.id}`;
    return this.http.put<Product>(url, product, { headers: this.headers });
  }

  public delete(idProduct: string) {
    const url = `${this.baseUrl}/products/${idProduct}`;
    return this.http.delete(url, { headers: this.headers, responseType: 'text' })
  }

  public verify(idProduct: string) {
    const url = `${this.baseUrl}/products/verification/${idProduct}`
  
    return this.http.get<boolean>(url, { headers: this.headers })
  }
}
