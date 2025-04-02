import { HttpStatus, Logger } from '@nestjs/common';
import { GeneralResponse } from './handleResponse';
import { ResponseStatus } from '../utils/enum';
import { Messages } from '../utils/message';
import * as admin from 'firebase-admin';

export async function paginateWithData(
  model: any,
  page?: number,
  pageSize?: number,
  options: any = {},
  dataKey: string = 'data',
) {
  let result;
  if (!page || !pageSize) {
    result = await model.findAndCountAll(options);
  } else {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const queryOptions = {
      ...options,
      offset,
      limit,
    };

    result = await model.findAndCountAll(queryOptions);
  }

  return {
    [dataKey]: result.rows,
    totalItems: result.count,
    totalPages: Math.ceil(result.count / (pageSize as number)) || 1,
    currentPage: page,
    pageSize: pageSize,
    numberOfRows: result.rows.length,
  };
}

export function sorting(sortKey: string, sortValue: string) {
  let sortQuery: [string, string][] = [];

  if (sortKey && sortValue) {
    if (sortValue === 'asc' || sortValue === 'desc') {
      sortQuery.push([sortKey, sortValue.toUpperCase()]);
    }
  } else {
    sortQuery.push(['id', 'DESC']);
  }

  return sortQuery;
}

export async function sendFCMNotification(tokens, title, body) {
  if (!tokens || tokens.length === 0) {
    Logger.error(Messages.DEVICE_TOKEN_NOT_FOUND);
    return GeneralResponse(
      HttpStatus.NOT_FOUND,
      ResponseStatus.ERROR,
      Messages.DEVICE_TOKEN_NOT_FOUND,
    );
  }

  const message = {
    tokens,
    notification: { title, body },
    data: { click_action: 'NOTIFICATION_CLICK' },
    apns: {
      payload: {
        aps: {
          alert: { title, body },
          sound: 'default',
          contentAvailable: true,
        },
      },
    },
    webpush: {
      notification: {
        title,
        body,
      },
    },
  };

  try {
    Logger.log(`Sending notifications to ${tokens.length} devices.`);
    const response = await admin.messaging().sendEachForMulticast(message);

    if (response.failureCount > 0) {
      Logger.warn(
        `Notification partially sent: ${response.successCount} succeeded, ${response.failureCount} failed.`,
      );
    } else {
      Logger.log(`Notification sent successfully to all devices.`);
    }

    return GeneralResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      Messages.NOTIFICATION_SENT_SUCCESS,
      {
        successCount: response.successCount,
        failureCount: response.failureCount,
        failedTokens: response.responses
          .map((res, index) => (!res.success ? tokens[index] : null))
          .filter(Boolean),
      },
    );
  } catch (error) {
    Logger.error(Messages.NOTIFICATION_SEND_FAILED, error);
    return GeneralResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ResponseStatus.ERROR,
      Messages.NOTIFICATION_SEND_FAILED,
      { error: error.message },
    );
  }
}
