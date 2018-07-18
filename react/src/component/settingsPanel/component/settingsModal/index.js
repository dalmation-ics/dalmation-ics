// @flow
import React, {Component} from 'react';
import thunkBindActionCreators from 'src/_core/redux/thunkBindActionCreators';
import {connect} from 'react-redux';
import {Button, Modal, ModalHeader, ModalFooter, ModalBody} from 'reactstrap';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import action_UI_ToggleSettingsMenu
  from 'src/_redux/action/action_UI/action_UI_ToggleSettingsMenu/index';
import SettingsPanelComponentList
  from '../settingsPanelComponent';
import type {ActionBound, Dispatch} from 'src/_core/redux/types';

class MenuSettings extends Component<{
  action_UI_ToggleSettingsMenu: ActionBound,
  settingsMenuOpen: boolean,
}, {
  activeTab: number
}> {
  state = {
    activeTab: 1,
  };
  static settingsItemList = () => {
    if (SettingsPanelComponentList === null ||
        SettingsPanelComponentList === undefined) {
      return [];
    }
    return SettingsPanelComponentList;
  };

  toggle(tab: number) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  wrapSettingsPanelCell = (Content, index) => {
    return <TabPane name={index}
                    tabId={index}
                    key={'settingsPanelComponentCell_' + index}
    >
      <p>test</p>
      <Content/>
    </TabPane>;
  };

  makeTabHeader = (item, index) => {
    return <NavItem key={'settingsPanelTabNavItem_' + index}>
      <NavLink
          key={'settingsPanelTabNavLink_' + index}
          active={this.state.activeTab === index}
          onClick={() => {
            this.toggle(index);
          }}
      >
        {'Tab ' + index}
      </NavLink>
    </NavItem>;
  };

  makeSettingsComponentList = (list) => {
    return list.map((w, i) => {
      return this.wrapSettingsPanelCell(w, i);
    });

  };

  makeTabHeaderList = (list) => {
    return list.map((w, i) => {
      return this.makeTabHeader(w, i);
    });
  };

  render() {

    const {
      settingsMenuOpen,
    } = this.props;
    const {
      action_UI_ToggleSettingsMenu,
    } = this.props;
    const list = MenuSettings.settingsItemList();

    return (
        <Modal size={'lg'} style={{maxWidth: '90%'}} isOpen={settingsMenuOpen}
               toggle={() => {
                 action_UI_ToggleSettingsMenu();
               }}>
          <ModalHeader>
            Settings
          </ModalHeader>
          <ModalBody>
            <Nav tabs>
              {this.makeTabHeaderList(list)}
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              {this.makeSettingsComponentList(list)}
            </TabContent>
          </ModalBody>
          <ModalFooter>
            <Button size={'lg'} onClick={() => {
              action_UI_ToggleSettingsMenu(false);
            }}>Close</Button>
          </ModalFooter>
        </Modal>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    settingsMenuOpen: state.uiStore.settingsMenuOpen,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return thunkBindActionCreators({
    action_UI_ToggleSettingsMenu,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuSettings);

