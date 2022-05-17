import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import {
  Nav, NavItem, NavList,
  Page, PageHeader, PageSidebar
} from "@patternfly/react-core";
import { FilesPage }      from "./files-page";


interface AppState {
  sidebarOpen: boolean;
}

interface AppProps {
  // Empty
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      sidebarOpen: true
    };
  }

  sidebarToggle = () => {
    this.setState({
      sidebarOpen: !this.state.sidebarOpen
    });
  }

  render() {

    const { sidebarOpen } = this.state;

    const Header = (
      <PageHeader
        logoComponent="span"
        logo="WebDAV"
        showNavToggle
        isNavOpen={sidebarOpen}
        onNavToggle={this.sidebarToggle}
      >
      </PageHeader>
    );

    const Navigation = (
      <Nav theme="dark">
        <NavList>
          <NavItem>
            <NavLink exact to='/web/files' activeClassName="pf-m-current">Files</NavLink>
          </NavItem>
        </NavList>
      </Nav>
    );

    const Sidebar = <PageSidebar nav={ Navigation } isNavOpen={ sidebarOpen } />;

    return (
      <Router>
        <Page header={ Header } sidebar={ Sidebar }>
          <Switch>
            <Route exact path='/web/files'>
              <FilesPage> </FilesPage>
            </Route>
          </Switch>
        </Page>
      </Router>
    );
  }
}