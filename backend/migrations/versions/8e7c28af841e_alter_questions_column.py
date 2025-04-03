"""alter questions column

Revision ID: 8e7c28af841e
Revises: b5a4713f9dbe
Create Date: 2025-04-03 22:58:39.429956

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM



# revision identifiers, used by Alembic.
revision: str = '8e7c28af841e'
down_revision: Union[str, None] = 'b5a4713f9dbe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

solutionstatus = ENUM(
    'NOT_SOLVED', 'TEMPORARY_SOLVED', 'PERMANENT_SOLVED',
    name='solutionstatus'
)



def upgrade():
    # Enum型の作成
    solutionstatus.create(op.get_bind(), checkfirst=True)

    # boolean型からsolutionstatus型への変換
    op.execute('''
        ALTER TABLE questions
        ALTER COLUMN is_correct TYPE solutionstatus USING 
            CASE 
                WHEN is_correct IS TRUE THEN 'PERMANENT_SOLVED'::solutionstatus
                WHEN is_correct IS FALSE THEN 'NOT_SOLVED'::solutionstatus
                ELSE 'TEMPORARY_SOLVED'::solutionstatus
            END
    ''')

def downgrade():
    # カラムの型変更を元に戻す
    op.execute('''
        ALTER TABLE questions
        ALTER COLUMN is_correct TYPE BOOLEAN USING is_correct::BOOLEAN
    ''')

    # Enum型の削除
    solutionstatus.drop(op.get_bind(), checkfirst=True)