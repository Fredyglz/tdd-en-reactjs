export const makeFakeResponse = ({ totalCount = 0 }) => ({
  total_count: totalCount,
  items: [],
});

export const makeFakeRepo = () => ({
  id: 33397954,
  name: 'qt5reactor',
  owner: {
    avatar_url: 'https://avatars.githubusercontent.com/u/716546?v=4',
  },
  html_url: 'https://github.com/twisted/qt5reactor',
  updated_at: '2022-04-11',
  stargazers_count: 43,
  forks_count: 18,
  open_issues_count: 18,
});
