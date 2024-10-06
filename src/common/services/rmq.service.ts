import * as amqp from 'amqplib/callback_api';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RabbitMQService {
  private readonly queue = 'user-validation-queue';
  private readonly responseQueue = 'task-validation-response-queue';

  constructor(private readonly jwtService: JwtService) {}

  // Public method to start listening for JWT validation requests
  public listenForJwtValidationRequests() {
    console.log('RabbitMQService: Attempting to connect to RabbitMQ server...');

    amqp.connect('amqp://localhost', (error0, connection) => {
      if (error0) {
        console.error(
          'RabbitMQService: Error connecting to RabbitMQ:',
          error0.message,
        );
        throw error0;
      }
      console.log(
        'RabbitMQService: Successfully connected to RabbitMQ server.',
      );

      connection.createChannel((error1, channel) => {
        if (error1) {
          console.error(
            'RabbitMQService: Error creating channel:',
            error1.message,
          );
          throw error1;
        }
        console.log('RabbitMQService: Channel created successfully.');

        // Listen for JWT validation requests from the Task Service
        channel.assertQueue(this.queue, { durable: false }, (error2, _ok) => {
          if (error2) {
            console.error(
              'RabbitMQService: Error asserting queue:',
              error2.message,
            );
            throw error2;
          }
          console.log(`RabbitMQService: Listening on queue "${this.queue}".`);

          channel.consume(
            this.queue,
            async (msg) => {
              console.log(
                `RabbitMQService: Received message in queue "${this.queue}".`,
              );
              const jwtToken = msg.content.toString();
              console.log(
                `RabbitMQService: Received JWT for validation: ${jwtToken}`,
              );

              try {
                // Validate the JWT using JwtService
                const decodedToken = this.jwtService.verify(jwtToken);
                const isValid = !!decodedToken; // Assuming it's valid if no error thrown
                console.log(`RabbitMQService: JWT is valid: ${isValid}`);

                // Send back the validation result
                channel.assertQueue(
                  this.responseQueue,
                  { durable: false },
                  (error3, _ok) => {
                    if (error3) {
                      console.error(
                        'RabbitMQService: Error asserting response queue:',
                        error3.message,
                      );
                      throw error3;
                    }
                    console.log(
                      `RabbitMQService: Sending validation result to "${this.responseQueue}" queue.`,
                    );

                    channel.sendToQueue(
                      this.responseQueue,
                      Buffer.from(isValid ? 'valid' : 'invalid'),
                    );
                    console.log('RabbitMQService: Validation result sent.');
                  },
                );
              } catch (error) {
                console.error(
                  'RabbitMQService: Error validating JWT:',
                  error.message,
                );
                channel.assertQueue(
                  this.responseQueue,
                  { durable: false },
                  (error4, _ok) => {
                    if (error4) {
                      console.error(
                        'RabbitMQService: Error asserting response queue:',
                        error4.message,
                      );
                      throw error4;
                    }
                    console.log(
                      `RabbitMQService: Sending invalid result to "${this.responseQueue}" queue.`,
                    );

                    channel.sendToQueue(
                      this.responseQueue,
                      Buffer.from('invalid'),
                    );
                    console.log('RabbitMQService: Invalid result sent.');
                  },
                );
              }
            },
            { noAck: true },
          );
        });
      });
    });
  }
}
