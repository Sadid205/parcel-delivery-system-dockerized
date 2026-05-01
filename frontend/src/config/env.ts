interface EnvConfig {
  BASE_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = ["VITE_BASE_URL"];
  requiredEnvVariables.forEach((key) => {
    const _env = import.meta.env[key];
    if (!_env) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });
  return {
    BASE_URL: import.meta.env.VITE_BASE_URL,
  };
};

export const envVars = loadEnvVariables();
