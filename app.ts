import Unity from '@unity/core';
import { UserController, MessageController } from './api';

new Unity({
    user: UserController,
    message: MessageController
});