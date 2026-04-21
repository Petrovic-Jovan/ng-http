import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

function loggingInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  // Clone the request to add the new header.
  // By setting these headers, backend will respond with an error, which is expected for this demo.
  const req = request.clone({
    headers: request.headers.set('X-DEBUG', 'TESTING'),
  });
  console.log('[Outgoing Request!] ' + request.url);
  console.log(request);
  return next(req);
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptors([loggingInterceptor]))],
}).catch((err) => console.error(err));
