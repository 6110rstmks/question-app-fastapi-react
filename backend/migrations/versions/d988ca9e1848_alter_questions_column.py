"""alter questions column

Revision ID: d988ca9e1848
Revises: e1c0700ffd45
Create Date: 2025-02-12 15:35:33.167015

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd988ca9e1848'
down_revision: Union[str, None] = 'e1c0700ffd45'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('questions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('problem', sa.String(), nullable=False),
    sa.Column('answer', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('is_correct', sa.Boolean(), nullable=False),
    sa.Column('answer_count', sa.Integer(), nullable=False),
    sa.Column('last_answered_date', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('salt', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('category_question',
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('question_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
    sa.PrimaryKeyConstraint('category_id', 'question_id')
    )
    op.create_table('subcategories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('subcategory_question',
    sa.Column('subcategory_id', sa.Integer(), nullable=False),
    sa.Column('question_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
    sa.ForeignKeyConstraint(['subcategory_id'], ['subcategories.id'], ),
    sa.PrimaryKeyConstraint('subcategory_id', 'question_id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('subcategory_question')
    op.drop_table('subcategories')
    op.drop_table('category_question')
    op.drop_table('categories')
    op.drop_table('users')
    op.drop_table('questions')
    # ### end Alembic commands ###
