import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../interfaces/Products';
import { ProductService } from './product.service';

describe('ProductService', () => {
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

    describe('get()', () => {
        it('debería devolver una lista de productos', () => {
            const dummyProducts: Product[] = [
                { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() },
                { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() }
            ];

            service.get().subscribe(products => {
                expect(products.length).toBe(2); // Verifica que la longitud de la respuesta sea 2
                expect(products).toEqual(dummyProducts); // Verifica que la respuesta sea igual a la lista dummy
            });

            const req = httpMock.expectOne('https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products');
            expect(req.request.method).toBe('GET'); // Verifica que el método de solicitud sea GET
            req.flush(dummyProducts); // Devuelve la lista de productos dummy
        });
    });

    describe('post()', () => {
        it('debería añadir un nuevo producto', () => {
            const newProduct: Product = { id: '3', name: 'Product 3', description: 'Description 3', logo: 'logo3.png', date_release: new Date(), date_revision: new Date() };

            service.post(newProduct).subscribe(product => {
                expect(product).toEqual(newProduct); // Verifica que el producto devuelto sea igual al producto nuevo
            });

            const req = httpMock.expectOne('https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products');
            expect(req.request.method).toBe('POST'); // Verifica que el método de solicitud sea POST
            req.flush(newProduct); // Devuelve el producto nuevo
        });
    });

    describe('put()', () => {
        it('debería actualizar un producto', () => {
            const updatedProduct: Product = { id: '1', name: 'Updated Product 1', description: 'Updated Description 1', logo: 'updated_logo1.png', date_release: new Date(), date_revision: new Date() };

            service.put(updatedProduct).subscribe(product => {
                expect(product).toEqual(updatedProduct); // Verifica que el producto devuelto sea igual al producto actualizado
            });

            const req = httpMock.expectOne('https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products');
            expect(req.request.method).toBe('PUT'); // Verifica que el método de solicitud sea PUT
            req.flush(updatedProduct); // Devuelve el producto actualizado
        });
    });

    describe('delete()', () => {
        it('debería eliminar un producto', () => {
            const idProduct = '1';

            service.delete(idProduct).subscribe(response => {
                expect(response).toBe(''); // Verifica que la respuesta sea una cadena vacía (según el tipo de respuesta que se espera)
            });

            const req = httpMock.expectOne(`https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products?id=${idProduct}`);
            expect(req.request.method).toBe('DELETE'); // Verifica que el método de solicitud sea DELETE
            req.flush(''); // Devuelve una cadena vacía
        });
    });

    describe('verify()', () => {
        it('debería verificar un producto', () => {
            const idProduct = '1';
            const verificationResult = true;

            service.verify(idProduct).subscribe(result => {
                expect(result).toBe(verificationResult); // Verifica que el resultado de la verificación sea verdadero
            });

            const req = httpMock.expectOne(`https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products/verification?id=${idProduct}`);
            expect(req.request.method).toBe('GET'); // Verifica que el método de solicitud sea GET
            req.flush(verificationResult); // Devuelve el resultado de verificación
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
