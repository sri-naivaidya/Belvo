type ErrorLike = {
  code?: string;
  message?: string;
  name?: string;
};

function errorLike(error: unknown): ErrorLike {
  return error && typeof error === 'object' ? error as ErrorLike : {};
}

export function logApiError(scope: string, error: unknown) {
  const details = errorLike(error);
  console.error(`[${scope}]`, {
    code: details.code,
    name: details.name,
    message: details.message,
  });
}

export function authFailureMessage(error: unknown) {
  const details = errorLike(error);
  const message = details.message ?? '';
  const code = details.code ?? '';

  if (message.includes('AUTH_SECRET')) {
    return {
      status: 500,
      error: 'Server auth is not configured. Set AUTH_SECRET in the deployment environment.',
    };
  }

  if (code === 'P2021' || code === 'P2022') {
    return {
      status: 500,
      error: 'Database schema is missing or outdated. Run the Prisma migration on the configured database.',
    };
  }

  if (code.startsWith('P10') || message.toLowerCase().includes('database') || message.toLowerCase().includes('connect')) {
    return {
      status: 503,
      error: 'Database connection failed. Check DATABASE_URL and database network access.',
    };
  }

  return {
    status: 500,
    error: 'Unexpected authentication server error. Check deployment logs for details.',
  };
}
