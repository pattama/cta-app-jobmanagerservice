const commandlineJob = {
  id: '001',
  nature: {
    type: 'Execution',
    quality: 'CommandLine',
  },
  payload: {
    stages: [
      {
        id: 'RUN01',
        run: 'echo Stage RUN01\n' +
          'echo Test - Current working directory is: $PWD\n' +
          'echo Test - Env variables: FOO is $FOO.\n' +
          'sleep 1\n' +
          'exit 0\n',
        stop: 'echo Test - Do stop operations...',
        cwd: 'C:\\tmp',
        env: [
          {
            key: 'FOO',
            value: 'bar',
          },
          {
            key: 'BAZ',
            value: 'quz',
          },
        ],
        timeout: 10000,
      },
      {
        id: 'RUN02',
        run: 'echo Stage RUN02\nsleep 1\nexit 0',
        stop: 'echo Test - Do stop operations...',
      },
    ],
    timeout: 20000,
  },
};

module.exports = {
  commandlineJob,
};
