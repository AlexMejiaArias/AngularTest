import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../interfaces/Products';
import { ProductService } from './product.service';
import { environment } from '../../../environment/environment';

describe('ProductService', () => {
    const API_URL = environment.apiUrl
    let service: ProductService;
    let httpMock: HttpTestingController;

    // Se ejecuta antes de cada prueba
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule], // Importa el módulo de pruebas para HttpClient
            providers: [ProductService] // Proporciona el servicio a probar
        });

        service = TestBed.inject(ProductService); // Obtiene una instancia del servicio
        httpMock = TestBed.inject(HttpTestingController); // Obtiene una instancia del HttpTestingController
    });

    // Se ejecuta después de cada prueba para asegurarse de que no queden solicitudes abiertas
    afterEach(() => {
        httpMock.verify(); // Verifica que no hay solicitudes pendientes
    });

    it('debería ser creado', () => {
        expect(service).toBeTruthy(); // Verifica que el servicio se haya creado
    });



    describe('post()', () => {

        it('debería retornar EMPTY si get() falla', () => {
            service.get().subscribe(
                result => {
                    expect(result).toEqual([]);
                }
            );

            const req = httpMock.expectOne(`${API_URL}/products`);
            req.flush(
                { message: 'Error de prueba' },  // cuerpo de la respuesta de error
                { status: 500, statusText: 'Internal Server Error' }
            );
        });

        it('debería emitir null como valor inicial de currentProduct', () => {
            service.currentProduct.subscribe(value => {
                expect(value).toBeNull();
            });
        });

        it('debería añadir un nuevo producto', () => {
            const newProduct: Product = { id: '3', name: 'Product 3', description: 'Description 3', logo: 'logo3.png', date_release: new Date(), date_revision: new Date() };

            service.post(newProduct).subscribe(product => {
                expect(product).toEqual(newProduct); // Verifica que el producto devuelto sea igual al producto nuevo
            });

            const req = httpMock.expectOne(`${API_URL}/products`);
            expect(req.request.method).toBe('POST'); // Verifica que el método de solicitud sea POST
            req.flush(newProduct); // Devuelve el producto nuevo
        });
    });





    describe('changeProduct()', () => {
        it('debería actualizar el producto actual', () => {
            const product: Product = { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() };

            service.changeProduct(product);
            service.currentProduct.subscribe(currentProduct => {
                expect(currentProduct).toEqual(product); // Verifica que el producto actual sea igual al producto pasado
            });
        });
    });
});
