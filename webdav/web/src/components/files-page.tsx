import * as React from "react";
import {
  PageSection,
  PageSectionVariants
} from "@patternfly/react-core";
import { ComposableTableSortable } from './table';
interface FilesPageState {
  // Empty
}

interface FilesPageProps {
  // Empty
}


export class FilesPage extends React.Component<FilesPageProps, FilesPageState> {
  constructor(props: FilesPageProps) {
    super(props);
    this.state = {
    }
  }

  componentDidMount(){
    document.title = "Files | View Controller"
  }

  render() {
    console.log('Rendering files page ...')
    return (
      <PageSection variant={PageSectionVariants.light}>
        <ComposableTableSortable /> 
      </PageSection>

    );
  }
}