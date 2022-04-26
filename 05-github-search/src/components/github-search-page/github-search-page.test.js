import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { OK_STATUS } from '../../consts/index';
import GithubSearchPage from './github-search-page';
import { makeFakeRepo, makeFakeResponse } from '../../__fixtures__/repos';

const fakeResponse = makeFakeResponse({ totalCount: 1 });
fakeResponse.items = [makeFakeRepo()];

const fakeRepo = makeFakeRepo();

const server = setupServer(
  rest.get('/search/repositories', (req, res, ctx) => {
    return res(ctx.status(OK_STATUS), ctx.json(fakeResponse));
  })
);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  render(<GithubSearchPage />);
});

const fireClickSearch = () =>
  fireEvent.click(screen.getByRole('button', { name: /search/i }));

describe('when the GithubSearchPage is mounted', () => {
  it('must display the title', () => {
    expect(screen.getByText(/github repositories list/i)).toBeInTheDocument();
  });

  it("must be an input text with label 'filter by' field", () => {
    expect(screen.getByLabelText(/filter by/i)).toBeInTheDocument();
  });

  it('must be a search button', () => {
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it("must be a initial message 'Please provide a search option and click in the searc button'", () => {
    expect(
      screen.getByText(
        /please provide a search option and click in the search button/i
      )
    ).toBeInTheDocument();
  });
});

describe('when the developer does a search', () => {
  it('the search button should be disabled until the search is done', async () => {
    expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled();

    // click btn
    fireClickSearch();

    // expect disabled
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();

    // not disables (finish) async
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled()
    );
  });

  it('the data should be displayed as a sticky table', async () => {
    fireClickSearch();

    // not initial state message
    await waitFor(() => {
      expect(
        screen.queryByText(
          /please provide a search option and click in the search button/i
        )
      ).not.toBeInTheDocument();
    });

    // table
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('the table headers must contain: Repository, stars, forks, open issues and updates', async () => {
    fireClickSearch();

    const table = await screen.findByRole('table');
    const tableHeaders = within(table).getAllByRole('columnheader');

    expect(tableHeaders).toHaveLength(5);

    const [repository, stars, forks, openIssues, updatedAt] = tableHeaders;
    expect(repository).toHaveTextContent(/repository/i);
    expect(stars).toHaveTextContent(/stars/i);
    expect(forks).toHaveTextContent(/forks/i);
    expect(openIssues).toHaveTextContent(/open issues/i);
    expect(updatedAt).toHaveTextContent(/updated at/i);
  });

  it('each table result must contain: owner avatar image, name, stars, updated at, forks, open issues, it should have a link that opens in a new tab', async () => {
    fireClickSearch();

    const table = await screen.findByRole('table');
    const withInTable = within(table);
    const tableCells = withInTable.getAllByRole('cell');
    const [repository, stars, forks, openIssues, updatedAt] = tableCells;

    const avatarImg = within(repository).getByRole('img', {
      name: fakeRepo.name,
    });

    expect(avatarImg).toBeInTheDocument();
    expect(tableCells).toHaveLength(5);

    expect(repository).toHaveTextContent(fakeRepo.name);
    expect(stars).toHaveTextContent(fakeRepo.stargazers_count);
    expect(forks).toHaveTextContent(fakeRepo.forks_count);
    expect(openIssues).toHaveTextContent(fakeRepo.open_issues_count);
    expect(updatedAt).toHaveTextContent(fakeRepo.updated_at);

    expect(withInTable.getByText(fakeRepo.name).closest('a')).toHaveAttribute(
      'href',
      fakeRepo.html_url
    );
    expect(avatarImg).toHaveAttribute('src', fakeRepo.owner.avatar_url);
  });

  it('must display the total results number of the search and the current number of results', async () => {
    fireClickSearch();

    await screen.findByRole('table');

    expect(screen.getByText(/1–1 of 1/)).toBeInTheDocument();
  });

  it('result size per page select/combobox with the options: 30, 50, 100. The default is 30', async () => {
    fireClickSearch();

    await screen.findByRole('table');

    expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i));

    const listbox = screen.getByRole('listbox', { name: /rows per page/i });
    const options = within(listbox).getAllByRole('option');
    const [option30, option50, option100] = options;

    expect(options).toHaveLength(3);
    expect(option30).toHaveTextContent(/30/i);
    expect(option50).toHaveTextContent(/50/i);
    expect(option100).toHaveTextContent(/100/i);
  });

  it('must exists the next and previous pagination', async () => {
    fireClickSearch();

    await screen.findByRole('table');

    const previousPageBtn = screen.getByRole('button', {
      name: /previous page/i,
    });

    expect(previousPageBtn).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /next page/i })
    ).toBeInTheDocument();
    expect(previousPageBtn).toBeDisabled();
  });
});

describe('when the developer does a search without results', () => {
  it('must show a empty state message "you search has not results"', async () => {
    // set the mock server no items
    server.use(
      rest.get('/search/repositories', (req, res, ctx) => {
        return res(ctx.status(OK_STATUS), ctx.json(makeFakeResponse({})));
      })
    );

    // click a search
    fireClickSearch();

    // expect message no results
    await waitFor(() => {
      expect(
        screen.getByText(/your search has no results/i)
      ).toBeInTheDocument();
    });

    // expect not a table
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
