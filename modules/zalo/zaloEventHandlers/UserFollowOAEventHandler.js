const { ObjectId } = require('mongodb');
const ZaloIdentifier = require('../ZaloIdentifier');

class UserFollowOAEventHandler {
  /**
   *
   * @param zaloInterestedUserProvider
   * @param request
   * @param userProvider
   * @param config
   * @param zaloMessageSender
   */
  constructor(zaloInterestedUserProvider, request, userProvider, config, zaloMessageSender) {
    this.zaloInterestedUserProvider = zaloInterestedUserProvider;
    this.request = request;
    this.userProvider = userProvider;
    this.config = config;
    this.zaloMessageSender = zaloMessageSender;
  }

  /**
   *
   * @param data
   * @returns {Promise<*>}
   */
  async handle(data) {
    const user = await this.userProvider.findByZaloId(data.oa_id);
    const { zaloApi: { officialAccount: { getInterestedUserProfile } } } = this.config;
    const userInfo = await this.request(`${getInterestedUserProfile}?access_token=${user.zaloOA.accessToken}&data={"user_id":"${data.follower.id}"}`,
      {
        method: 'GET',
      }).then((response) => response.json());

    const phoneNumber = userInfo.data.shared_info ? userInfo.data.shared_info.phone : null;
    const zaloId = ZaloIdentifier.factory({
      zaloIdByOA: data.follower.id, OAID: data.oa_id, appId: data.app_id, zaloIdByApp: data.user_id_by_app,
    });

    if (!phoneNumber) {
      this.zaloMessageSender.sendRequestUserInfo({ content: '' }, { zaloId: data.follower.id }, user);
      return this.zaloInterestedUserProvider.create({
        displayName: userInfo.data.display_name,
        dob: userInfo.data.birth_date,
        gender: userInfo.data.user_gender === 1 ? 'male' : 'female',
        avatar: userInfo.data.avatar,
        avatars: userInfo.data.avatars,
        timestamp: data.timestamp,
        state: 'deactive',
        followings: [
          { zaloId: zaloId.toJson(), userId: user.id },
        ],

      });
    }

    const interestedUser = await this.zaloInterestedUserProvider.findByZaloIndentifier(zaloId);
    let { followings } = interestedUser;
    const foundFollowIndex = followings.findIndex((follow) => JSON.stringify(follow.zaloId.toJson()) === JSON.stringify(zaloId.toJson()));
    interestedUser.followings[foundFollowIndex] = { zaloId, userId: ObjectId(user.id), state: 'active' };

    followings = followings.map((following) => ({
      userId: following.userId,
      zaloId: following.zaloId.toJson(),
      state: following.state,
    }));

    return this.zaloInterestedUserProvider.update(interestedUser.id, {
      followings,
    });
  }

  static getEvent() {
    return 'follow';
  }
}

module.exports = UserFollowOAEventHandler;
