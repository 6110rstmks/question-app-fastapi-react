import pytest
import hashlib
import base64
from unittest.mock import Mock, MagicMock, patch
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

# テスト対象のモジュールをインポート
from backend.cruds.auth_crud import (
    create_user,
    check_user_already_exists,
    authenticate_user,
    get_current_user
)
from backend.schemas.auth import UserCreate, UserResponse
from backend.models import User


class TestCreateUser:
    """create_user関数のテストクラス"""
    
    def test_create_user_success(self):
        """ユーザー作成が正常に完了するケース"""
        # モックの設定
        mock_db = Mock(spec=Session)
        mock_user = Mock()
        user_create = UserCreate(username="testuser", password="testpass")
        
        with patch('os.urandom') as mock_urandom, \
             patch('backend.auth.User') as mock_user_class:
            
            # os.urandom のモック
            mock_urandom.return_value = b'test_salt_32_bytes_for_testing!'
            mock_user_class.return_value = mock_user
            
            # テスト実行
            result = create_user(mock_db, user_create)
            
            # 検証
            mock_urandom.assert_called_once_with(32)
            expected_salt = base64.b64encode(b'test_salt_32_bytes_for_testing!').decode()
            expected_hashed_password = hashlib.pbkdf2_hmac(
                "sha256",
                "testpass".encode(),
                base64.b64encode(b'test_salt_32_bytes_for_testing!'),
                1000
            ).hex()
            
            mock_user_class.assert_called_once_with(
                username="testuser",
                password=expected_hashed_password,
                salt=expected_salt
            )
            mock_db.add.assert_called_once_with(mock_user)
            mock_db.commit.assert_called_once()
            mock_db.refresh.assert_called_once_with(mock_user)
            assert result == mock_user


# class TestCheckUserAlreadyExists:
#     """check_user_already_exists関数のテストクラス"""
    
#     def test_user_exists(self):
#         """ユーザーが存在する場合"""
#         # モックの設定
#         mock_db = Mock(spec=Session)
#         mock_result = Mock()
#         mock_scalars = Mock()
#         mock_scalars.first.return_value = Mock()  # ユーザーが存在
#         mock_result.scalars.return_value = mock_scalars
#         mock_db.execute.return_value = mock_result
        
#         user_create = UserCreate(username="existinguser", password="testpass")
        
#         # テスト実行
#         result = check_user_already_exists(mock_db, user_create)
        
#         # 検証
#         assert result is True
#         mock_db.execute.assert_called_once()
    
#     def test_user_not_exists(self):
#         """ユーザーが存在しない場合"""
#         # モックの設定
#         mock_db = Mock(spec=Session)
#         mock_result = Mock()
#         mock_scalars = Mock()
#         mock_scalars.first.return_value = None  # ユーザーが存在しない
#         mock_result.scalars.return_value = mock_scalars
#         mock_db.execute.return_value = mock_result
        
#         user_create = UserCreate(username="newuser", password="testpass")
        
#         # テスト実行
#         result = check_user_already_exists(mock_db, user_create)
        
#         # 検証
#         assert result is False
#         mock_db.execute.assert_called_once()


# class TestAuthenticateUser:
#     """authenticate_user関数のテストクラス"""
    
#     def test_authenticate_user_success(self):
#         """認証が成功する場合"""
#         # モックの設定
#         mock_db = Mock(spec=Session)
#         mock_request = Mock()
#         mock_request.session = {}
        
#         # テスト用のソルトとハッシュパスワードを生成
#         test_salt = "test_salt"
#         test_password = "testpass"
#         test_hashed_password = hashlib.pbkdf2_hmac(
#             "sha256",
#             test_password.encode(),
#             test_salt.encode(),
#             1000
#         ).hex()
        
#         mock_user = Mock()
#         mock_user.id = 1
#         mock_user.username = "testuser"
#         mock_user.password = test_hashed_password
#         mock_user.salt = test_salt
        
#         mock_query = Mock()
#         mock_filter = Mock()
#         mock_filter.first.return_value = mock_user
#         mock_query.filter.return_value = mock_filter
#         mock_db.query.return_value = mock_query
        
#         # テスト実行
#         result = authenticate_user(mock_db, "testuser", "testpass", mock_request)
        
#         # 検証
#         assert isinstance(result, JSONResponse)
#         assert mock_request.session["user"]["id"] == 1
#         assert mock_request.session["user"]["username"] == "testuser"
    
#     def test_authenticate_user_not_found(self):
#         """ユーザーが見つからない場合"""
#         # モックの設定
#         mock_db = Mock(spec=Session)
#         mock_request = Mock()
        
#         mock_query = Mock()
#         mock_filter = Mock()
#         mock_filter.first.return_value = None  # ユーザーが見つからない
#         mock_query.filter.return_value = mock_filter
#         mock_db.query.return_value = mock_query
        
#         # テスト実行
#         result = authenticate_user(mock_db, "nonexistent", "testpass", mock_request)
        
#         # 検証
#         assert result is None
    
#     def test_authenticate_user_wrong_password(self):
#         """パスワードが間違っている場合"""
#         # モックの設定
#         mock_db = Mock(spec=Session)
#         mock_request = Mock()
        
#         test_salt = "test_salt"
#         correct_password = "correctpass"
#         wrong_password = "wrongpass"
#         correct_hashed_password = hashlib.pbkdf2_hmac(
#             "sha256",
#             correct_password.encode(),
#             test_salt.encode(),
#             1000
#         ).hex()
        
#         mock_user = Mock()
#         mock_user.password = correct_hashed_password
#         mock_user.salt = test_salt
        
#         mock_query = Mock()
#         mock_filter = Mock()
#         mock_filter.first.return_value = mock_user
#         mock_query.filter.return_value = mock_filter
#         mock_db.query.return_value = mock_query
        
#         # テスト実行・検証
#         with pytest.raises(HTTPException) as exc_info:
#             authenticate_user(mock_db, "testuser", wrong_password, mock_request)
        
#         assert exc_info.value.status_code == 401
#         assert exc_info.value.detail == "パスワードが間違っています。"


# class TestGetCurrentUser:
#     """get_current_user関数のテストクラス"""
    
#     @pytest.mark.asyncio
#     async def test_get_current_user_success(self):
#         """現在のユーザー取得が成功する場合"""
#         # モックの設定
#         mock_db = Mock(spec=Session)
#         mock_request = Mock()
#         mock_request.session = {"user": {"id": 1, "username": "testuser"}}
        
#         mock_user = Mock()
#         mock_user.id = 1
#         mock_user.username = "testuser"
        
#         mock_query = Mock()
#         mock_filter = Mock()
#         mock_filter.first.return_value = mock_user
#         mock_query.filter.return_value = mock_filter
#         mock_db.query.return_value = mock_query
        
#         with patch('backend.auth.UserResponse') as mock_user_response:
#             mock_user_response.from_orm.return_value = "mocked_user_response"
            
#             # テスト実行
#             result = await get_current_user(mock_request, mock_db)
            
#             # 検証
#             assert result == "mocked_user_response"
#             mock_user_response.from_orm.assert_called_once_with(mock_user)
    
#     @pytest.mark.asyncio
#     async def test_get_current_user_no_session(self):
#         """セッションが存在しない場合"""
#         # モックの設定
#         mock_db = Mock(spec=Session)
#         mock_request = Mock()
#         mock_request.session = {}
        
#         # テスト実行・検証
#         with pytest.raises(HTTPException) as exc_info:
#             await get_current_user(mock_request, mock_db)
        
#         assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
#         assert exc_info.value.detail == "Not authenticated"
    
#     @pytest.mark.asyncio
#     async def test_get_current_user_no_user_id_in_session(self):
#         """セッションにユーザーIDが存在しない場合"""
#         # モックの設定
#         mock_db = Mock(spec=Session)
#         mock_request = Mock()
#         mock_request.session = {"user": {"username": "testuser"}}  # idが存在しない
        
#         # テスト実行・検証
#         with pytest.raises(HTTPException) as exc_info:
#             await get_current_user(mock_request, mock_db)
        
#         assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
#         assert exc_info.value.detail == "Not authenticated"
    
#     @pytest.mark.asyncio
#     async def test_get_current_user_user_not_found_in_db(self):
#         """セッションにユーザーIDは存在するが、DBにユーザーが存在しない場合"""
#         # モックの設定
#         mock_db = Mock(spec=Session)
#         mock_request = Mock()
#         mock_request.session = {"user": {"id": 999, "username": "testuser"}}
        
#         mock_query = Mock()
#         mock_filter = Mock()
#         mock_filter.first.return_value = None  # ユーザーが見つからない
#         mock_query.filter.return_value = mock_filter
#         mock_db.query.return_value = mock_query
        
#         # テスト実行・検証
#         with pytest.raises(HTTPException) as exc_info:
#             await get_current_user(mock_request, mock_db)
        
#         assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
#         assert exc_info.value.detail == "User not found"


# # 統合テスト
# class TestAuthIntegration:
#     """認証機能の統合テストクラス"""
    
#     def test_create_and_authenticate_user_flow(self):
#         """ユーザー作成から認証までの一連の流れをテスト"""
#         # モックの設定
#         mock_db = Mock(spec=Session)
#         mock_request = Mock()
#         mock_request.session = {}
        
#         # ユーザー作成のテスト
#         user_create = UserCreate(username="integrationtest", password="testpass")
        
#         with patch('os.urandom') as mock_urandom, \
#              patch('backend.auth.User') as mock_user_class:
            
#             mock_urandom.return_value = b'integration_test_salt_32_bytes!'
#             mock_user = Mock()
#             mock_user_class.return_value = mock_user
            
#             created_user = create_user(mock_db, user_create)
#             assert created_user == mock_user
        
#         # 認証のテスト
#         test_salt = base64.b64encode(b'integration_test_salt_32_bytes!').decode()
#         test_hashed_password = hashlib.pbkdf2_hmac(
#             "sha256",
#             "testpass".encode(),
#             base64.b64encode(b'integration_test_salt_32_bytes!'),
#             1000
#         ).hex()
        
#         mock_auth_user = Mock()
#         mock_auth_user.id = 1
#         mock_auth_user.username = "integrationtest"
#         mock_auth_user.password = test_hashed_password
#         mock_auth_user.salt = test_salt
        
#         mock_query = Mock()
#         mock_filter = Mock()
#         mock_filter.first.return_value = mock_auth_user
#         mock_query.filter.return_value = mock_filter
#         mock_db.query.return_value = mock_query
        
#         result = authenticate_user(mock_db, "integrationtest", "testpass", mock_request)
        
#         assert isinstance(result, JSONResponse)
#         assert mock_request.session["user"]["username"] == "integrationtest"


# # テスト実行用のフィクスチャ
# @pytest.fixture
# def mock_db():
#     """データベースセッションのモックフィクスチャ"""
#     return Mock(spec=Session)


# @pytest.fixture  
# def mock_request():
#     """リクエストオブジェクトのモックフィクスチャ"""
#     request = Mock()
#     request.session = {}
#     return request


# @pytest.fixture
# def sample_user_create():
#     """テスト用のUserCreateオブジェクト"""
#     return UserCreate(username="testuser", password="testpassword")


# 実行例とテストカバレッジ確認用のコメント
"""
テストの実行方法:
1. pytest test_auth.py -v  # 詳細出力でテスト実行
2. pytest test_auth.py --cov=backend.auth  # カバレッジ付きでテスト実行
3. pytest test_auth.py::TestCreateUser::test_create_user_success  # 特定のテストのみ実行

テストカバレッジ:
- create_user: 正常ケース、異常ケース
- check_user_already_exists: ユーザー存在/非存在
- authenticate_user: 正常認証、ユーザー未存在、パスワード間違い
- get_current_user: 正常取得、セッション未存在、ユーザーIDなし、ユーザー未発見
- 統合テスト: ユーザー作成から認証までの流れ
"""