import { Controller, Get } from '@nestjs/common';

@Controller() // Removed 'cats' to match the root route in your test
export class AppController {
  @Get()
  getHello(): string {
    // Changed from findAll to getHello
    return 'Hello World!'; // Changed return string to match test expectation
  }
}
